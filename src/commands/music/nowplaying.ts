import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';
import Util from '../../lib/util/Util'

export default class SkipCommand extends Command {
    constructor() {
        super('nowplaying', {
            aliases: ['nowplaying', 'np'],
            description: {
                content: 'Displays the current playing song'
            },
            category: 'music'
        });
    }

    async exec(message: Message) {
        const guild = message.guild!.id;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) return message.reply('there is no player in this guild');
        if (!player.queue.current) return message.reply;

        const { title, uri, duration, thumbnail, requester } = player.queue.current;
        const segment = Math.floor((player.position / duration!) * 10);
        return message.channel.send(new this.client.embed().setMain()
            .setDescription(
                [
                    `${player.playing ? "**▶**" : "**⏸**"} Currently Playing:`,
                    `Track: [${title}](${uri})`,
                    `${"▬".repeat(segment) + "🔘" + "▬".repeat(10 - segment)} [${Util.msConversion(player.position)?.string} / ${Util.msConversion(duration)?.string}]`,
                    `Requested By: ${requester}`
                ].join("\n")
            )
            .setThumbnail(thumbnail!)
        )
    }
}


