import { ShardingManager } from "discord.js";

import dotenv from 'dotenv';
dotenv.config();

const ShardManager = new ShardingManager('./dist/index.js', {
    totalShards: 'auto',
    shardList: 'auto',
    token: process.env.TOKEN
});
ShardManager.spawn();