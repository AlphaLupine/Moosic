import { ShardingManager } from "discord.js";
import { Logger } from './lib/util/Logger';

import dotenv from 'dotenv';
dotenv.config();

const logger = new Logger();

const ShardManager = new ShardingManager('./dist/index.js', {
    totalShards: 'auto',
    shardList: 'auto',
    token: process.env.TOKEN
});
ShardManager.spawn();
ShardManager.on('shardCreate', shard => logger.log(`Successfully created shard ${shard.id}`));