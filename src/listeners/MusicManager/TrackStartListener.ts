import { Listener } from 'discord-akairo';
import type { TextChannel } from 'discord.js';
import { Player } from 'erela.js';
import  Utils  from '../../lib/util/Util';
import type { Track } from "erela.js/structures/Player";

export default class TrackStartListener extends Listener {
    constructor() {
        super('trackStart', {
            emitter: 'musicManager',
            event: 'trackStart'
        });
    }

    async exec(player: Player, track: Track) {
        const guild = this.client.guilds.cache.get(player.guild);
        const channel = guild!.channels.cache.get(player.textChannel!) as TextChannel;

        const embed = new this.client.embed().setMain()
            .setTitle("Now Playing:")
            .setDescription(
                [
                    `Song Name: [${track.title}](${track.uri})`,
                    `Uploader: ${track.author}`,
                    `Duration: ${Utils.msConversion(track.duration)?.string}`
                ].join('\n')
            )
            .setThumbnail(track.thumbnail!);

        if (channel) {
            const nowPlayingMessageID = this.client.NowPlayingCache.get(channel.id);
            if (nowPlayingMessageID && channel.lastMessageID === nowPlayingMessageID) {
                const lastMessage = channel.messages.cache.get(nowPlayingMessageID);
                if (lastMessage) return lastMessage.edit(embed);
            }

            const nowPlayingMessage = await channel.send(embed);
            return this.client.NowPlayingCache.set(channel.id, nowPlayingMessage.id);
        }
    }
}