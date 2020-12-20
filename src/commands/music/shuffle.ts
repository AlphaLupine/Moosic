import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class ShuffleCommand extends Command {
    constructor() {
        super('shuffle', {
            aliases: ['shuffle', 'jumble'],
            description: {
                content: 'Shuffles the current queue'
            },
            category: 'music'
        });
    }

    async exec(message: Message) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');
        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');
        if (!player.queue.current) return message.reply('there is no music to shuffle');

        if (player.queue.size < 2) return message.reply('there is only one song in the queue');

        player.queue.shuffle();

        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Queue shuffled by ${message.author.username}`)
            .setDescription('Queue successfully shuffled!')
        )

    }
}


