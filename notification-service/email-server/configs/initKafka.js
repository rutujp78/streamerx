const KafkaConfig = require("./kafkaConfig");
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.KAFKA_BROKER);

const kafkaConfig = new KafkaConfig([process.env.KAFKA_BROKER || 'kafka:9092']);

const initKafka = async () => {
    try {
        await kafkaConfig.connect();
        const topic1 = process.env.KAFKA_TOPIC1 || 'emails-promo';
        const topic2 = process.env.KAFKA_TOPIC2 || 'emails-otp';
        const topic3 = process.env.KAFKA_TOPIC3 || 'dlq-topic';
        await kafkaConfig.createTopic(topic1);
        await kafkaConfig.createTopic(topic2);
        await kafkaConfig.createTopic(topic3);
        await kafkaConfig.subscribe([ topic1, topic2, topic3 ]);
        await kafkaConfig.consume();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { kafkaConfig, initKafka };