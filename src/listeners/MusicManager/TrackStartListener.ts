import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Player } from 'erela.js';
import  Utils  from '../../lib/util/Util';

export default class TrackStartListener extends Listener {
    constructor() {
        super('trackStart', {
            emitter: 'musicManager',
            event: 'trackStart'
        });
    }

    exec(player: Player, track) {
       const channel = this.client.channels.cache.get(player.textChannel!);
        (channel as TextChannel).send(new this.client.embed().setMain()
            .setTitle('Now Playing:')
            .setDescription(
                [
                    `Song Name: [${track.title}](${track.uri})`,
                    `Uploader: ${track.author}`,
                    `Duration: ${Utils.msConversion(track.duration)?.string}`
                ].join('\n')
            )
            .setThumbnail(track.thumbnail)
        );
    }
}