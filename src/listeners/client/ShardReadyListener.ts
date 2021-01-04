import MoosicClient from '@lib/structures/MoosicClient';
import { Listener } from 'discord-akairo';

export default class ShardReadyListener extends Listener {
    constructor() {
        super('shardReady', {
            emitter: 'client',
            event: 'shardReady'
        });
    }

    exec(shard) {
        const prefix = this.client.commandHandler.prefix;
        this.client.musicManager.init(this.client.user!.id);
        this.client.logger.info("shardReady",`${this.client.user!.username} is ready | shard: ${shard}`);
        this.client.user?.setActivity(`${prefix}help`, { type: 'STREAMING',  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO'})
    }
}