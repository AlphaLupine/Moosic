import MoosicClient from '@lib/structures/MoosicClient';
import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        const prefix = this.client.commandHandler.prefix;
        this.client.musicManager.init(this.client.user!.id);
        this.client.logger.log(`${this.client.user!.username} is ready`);
        this.client.user?.setActivity(`${prefix}help`, { type: 'STREAMING',  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO'})
    }
}