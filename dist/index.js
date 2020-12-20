"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MoosicClient_1 = __importDefault(require("./lib/structures/MoosicClient"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new MoosicClient_1.default();
client.login(process.env.Token);
