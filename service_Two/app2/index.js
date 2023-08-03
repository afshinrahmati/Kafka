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
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
app.use(express_1.default.json());
const client = new kafka_node_1.default.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});
const producer = new kafka_node_1.default.Producer(client);
const dbsAreRunning = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URL);
    const user = new mongoose_1.default.Model("user", {
        name: String,
        email: String,
        password: String,
    });
    const client = new kafka_node_1.default.KafkaClient({
        kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    });
    const consumer = new kafka_node_1.default.Consumer(client, [{ topic: process.env.KAFKA_BOOTSTRAP_SERVERS }], {
        autoCommit: false,
    });
    consumer.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield user.create(JSON.parse(msg.value)).save();
    }));
    consumer.on("error", (error) => {
        console.log(error);
    });
});
setTimeout(dbsAreRunning, 1000);
app.listen(process.env.PORT, () => {
    console.log("app is ready on port 800");
});
//# sourceMappingURL=index.js.map