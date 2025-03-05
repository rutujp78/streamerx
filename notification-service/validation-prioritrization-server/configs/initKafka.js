const KafkaConfig = require("./kafkaConfig");
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.KAFKA_BROKER);

const kafkaConfig = new KafkaConfig([process.env.KAFKA_BROKER || 'kafka:9092']);

const initKafka = async () => {
    try {
        await kafkaConfig.connect();
        await kafkaConfig.createTopic(process.env.KAFKA_TOPIC1 || 'emails-promo');
        await kafkaConfig.createTopic(process.env.KAFKA_TOPIC2 || 'emails-otp');
        await kafkaConfig.createTopic(process.env.KAFKA_TOPIC3 || 'dlq-topic');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { kafkaConfig, initKafka };