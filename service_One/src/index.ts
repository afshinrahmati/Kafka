import express, { Request, Response } from "express";
import kafka from "kafka-node";
import { Sequelize } from "sequelize-typescript";
const app = express();
const db = new Sequelize({
  host: "",
  database: "some_db",
  dialect: "sqlite",
  username: "root",
  password: "",
  storage: ":memory:",
  models: [__dirname + "/models"],
});
const User = db.define("user", {
  name: "afshin",
  email: "afshinrahmati93@gmail.com",
  password: "123456789",
});
app.use(express.json());

const client = new kafka.KafkaClient({
  kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});
const producer = new kafka.Producer(client);
const dbsAreRunning = () => {
  producer.on("ready", () => {
    app.post("/", (_req: Request, _res: Response) => {
      producer.send(
        [
          {
            topic: process.env.KAFKA_TOPIC!,
            messages: JSON.stringify(_req.body),
          },
        ],
        async (err, data) => {
          if (err) {
            await User.create(data);
          }

          console.log(data);
        },
      );
    });
  });
};

setTimeout(dbsAreRunning, 1000);
app.listen(process.env.PORT, () => {
  console.log("app is ready on port 800");
});
