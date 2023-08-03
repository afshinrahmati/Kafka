import express, { Request, Response } from "express";
import kafka from "kafka-node";
const app = express();
import mongoose from "mongoose";
app.use(express.json());

const client = new kafka.KafkaClient({
  kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});
const producer = new kafka.Producer(client);
const dbsAreRunning = async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  const user = new mongoose.Model("user", {
    name: String,
    email: String,
    password: String,
  });
  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
  });
  const consumer = new kafka.Consumer(
    client,
    [{ topic: process.env.KAFKA_BOOTSTRAP_SERVERS! }],
    {
      autoCommit: false,
    },
  );
  consumer.on("message", async (msg) => {
    await user.create(JSON.parse(msg.value as string)).save();
  });
  consumer.on("error", (error) => {
    console.log(error);
  });
};

setTimeout(dbsAreRunning, 1000);
app.listen(process.env.PORT, () => {
  console.log("app is ready on port 800");
});
