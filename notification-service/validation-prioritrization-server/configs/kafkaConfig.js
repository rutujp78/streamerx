const { Kafka } = require("kafkajs");

class KafkaConfig {

    constructor(brokers) {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLI_ID,
            brokers: brokers,
        });
        
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin();
    }

    async connect() {
        try {
            await this.admin.connect();
            await this.producer.connect();
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

module.exports = KafkaConfig;