"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kafka_node_1 = __importDefault(require("kafka-node"));
const sequelize_typescript_1 = require("sequelize-typescript");
const app = (0, express_1.default)();
const db = new sequelize_typescript_1.Sequelize({
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
app.use(express_1.default.json());
const client = new kafka_node_1.default.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});
const producer = new kafka_node_1.default.Producer(client);
const dbsAreRunning = () => {
    producer.on("ready", () => {
        app.post("/", (_req, _res) => {
            producer.send([
                {
                    topic: process.env.KAFKA_TOPIC,
                    messages: JSON.stringify(_req.body),
                },
            ], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    yield User.create(data);
                }
                console.log(data);
            }));
        });
    });
};
setTimeout(dbsAreRunning, 1000);
app.listen(process.env.PORT, () => {
    console.log("app is ready on port 800");
});
//# sourceMappingURL=index.js.map