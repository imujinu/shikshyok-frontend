// kafka.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"], // Kafka 브로커 주소
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "order-group" });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
};
