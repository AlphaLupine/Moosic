import { Listener } from 'discord-akairo';
import { Player } from 'erela.js';
import { TextChannel } from 'discord.js';

export default class QueueEndListener extends Listener {
    constructor() {
        super('queueEnd', {
            emitter: 'musicManager',
            event: 'queueEnd'
        });
    }

    exec(player: Player) {
        const channel = this.client.channels.cache.get(player.textChannel!);
        (channel as TextChannel).send(new this.client.embed().setMain()
            .setTitle('End Of Queue')
            .setDescription('I ran out of songs to play')
        );
        player.destroy();
    }
}