import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class RepeatCommand extends Command {
    constructor() {
        super('repeat', {
            aliases: ['repeat', 'loop'],
            args: [
                {
                    id: 'repQueue',
                    type: 'string'
                }
            ],
            description: {
                content: 'Repeats the current track or queue',
                usage: '[queue]'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { repQueue }: args) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');
        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');
        if (!player.queue.current) return message.reply('there is no music to repeat');

        if (repQueue && /queue/i.test(repQueue)) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? 'enabled' : 'disabled';
            return message.channel.send(new this.client.embed().setMain()
                .setTitle(`Repeat Queue has been ${queueRepeat} by ${message.author.username}`)
            );
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? 'enabled' : 'disabled';
        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Repeat Track has been ${trackRepeat} by ${message.author.username}`)
        );
    }
}

type args = {
    repQueue:string
}


