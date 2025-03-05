const { Kafka } = require("kafkajs");
const sendEmail = require("../utils/mailer");
const Notification = require("../model/Notification");

class KafkaConfig {

    constructor(brokers) {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLI_ID,
            brokers: brokers,
        });

        this.consumer = this.kafka.consumer({ groupId: 'streamerx-emails' });
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin();
    }

    async connect() {
        try {
            await this.admin.connect();
            await this.producer.connect();
            await this.consumer.connect();
            console.log('Kafka connected successfully');
        } catch (error) {
            throw new Error('Something went wrong while connecting kafka');
        }
    }

    async createTopic(topic) {
        try {
            const topicExists = await this.admin.listTopics();

            if(!topicExists.includes(topic)) {
                await this.admin.createTopics({
                    topics: [{ topic }],
                });
                console.log('Topic created successfully');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async produceMessages(topic, messages) {
        try {
            await this.producer.send({
                topic: topic,
                messages: messages
            });
        } catch (error) {
            throw new Error('Something went wrong while sending message from kafka' + error);   
        }
    }

    async consume() {
        await this.consumer.run({
            eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) {
                const messages = batch.messages;
                for (const message of messages) {
                    let idOfNotification;
                    try {
                        if (!message.value) continue;

                        console.log('Msg received');
                        // buffer -> string
                        const stringMsg = message.value?.toString();
                        const notification = await JSON.parse(stringMsg);
                        const dbNotification = await Notification.findOne({ _id: notification._id });
                        idOfNotification = notification._id;
                        console.log('id of notification: ' + idOfNotification);
                        
                        if(!dbNotification) {
                            console.log('Notification with id: ' + idOfNotification + ' not found.');
                            // kafka code to acknowledge msg has processed;
                            resolveOffset(message.offset);
                            //@ts-ignore
                            await commitOffsetsIfNecessary(message.offset);
                            await heartbeat();
                            continue;
                        }

                        console.log(dbNotification);

                        if(notification?.content === undefined) {
                            notification.retryCount += 1;
                            throw new Error('Content is missing in msg');
                        }

                        notification.retryCount += 1;
                        dbNotification.save();

                        // send email
                        await sendEmail(notification);
                        console.log('email sent');
                        // update status in db
                        if(dbNotification) {
                            dbNotification.status = 'delivered';
                            dbNotification.save();
                        }
                    } catch (error) {
                        console.log(error);
                        
                        const dbNotification = await Notification.findOne({ _id: idOfNotification });
                        dbNotification.retryCount += 1;
                        await dbNotification.save();
                        
                        console.log('Saving after retry');
                        if (dbNotification.retryCount >= 3) {
                            console.error('Retry limit exceeded. Moving to DLQ:', dbNotification);

                            // Publish to DLQ
                            await this.produceMessages('dlq-topic', [
                                { value: JSON.stringify(dbNotification) },
                            ]);

                            // Update notification status to "failed"
                            dbNotification.status = 'failed';
                        } else {
                            console.warn(`Retrying message (attempt ${dbNotification.retryCount})...`);
                        }
                        
                    }

                    // kafka code to acknowledge msg has processed;
                    resolveOffset(message.offset);
                    //@ts-ignore
                    await commitOffsetsIfNecessary(message.offset);
                    await heartbeat();
                }
            }
        });
    }

    async subscribe(topics) {
        try {
            await this.consumer.subscribe({ topics: topics, fromBeginning: true });
            console.log(`Kafka subscribed to topics: ${topics.join(', ')}`);
        } catch (error) {
            throw new Error(`Something went wrong while subscribing to topic: ${topic}` + error);
        }
    }

    async disconnect() {
        try {
            await this.consumer.disconnect();
            await this.producer.disconnect();
            console.log('Kafka successfully disconnected');
        } catch (error) {
            throw new Error('Something went wrong while disconnecting kafka' + error);
        }
    }
}

module.exports = KafkaConfig