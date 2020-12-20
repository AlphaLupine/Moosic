import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';
import Utils from '../../lib/util/Util';

export default class QueueCommand extends Command {
    constructor() {
        super('queue', {
            aliases: ['queue', 'que'],
            args: [
                {
                    id: 'pageNum',
                    type: 'number'
                }
            ],
            description: {
                content: 'Displays the current queue',
                usage: '[page]'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { pageNum }: args) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');
        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');
        if (!player.queue.current) return message.reply('there is no music queue')

        const queue = player.queue;
        const queueEmbed = new this.client.embed().setMain()
            .setTitle(`Current queue for ${message.guild!.name}`);
        const limit: number = 8;
        const page = pageNum ? pageNum : 1;

        const end = page * limit;
        const start = end - limit;

        const tracks = queue.slice(start, end);

        queueEmbed.addField(`Currently Playing:`, `[${queue.current!.title}](${queue.current!.uri})`);
        if (!tracks.length) queueEmbed.setDescription(`No tracks present in ${page < 1 ? `page ${page}` : 'the queue'}`);

        else queueEmbed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) - ${Utils.msConversion(track.duration)?.string}`).join('\n'));

        const maxPages = Math.ceil(queue.length / limit);
        queueEmbed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

        return message.channel.send(queueEmbed);
    }
}

type args = {
    pageNum:number
}


