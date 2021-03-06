import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            aliases: ['skip', 'next'],
            description: {
                content: 'Skips the current track'
            },
            category: 'music'
        });
    }

    async exec(message: Message) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) return message.reply('there is no player in this guild');

        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');

        if (!player.queue.current) return message.reply('there is no music to skip')

        const { title } = player.queue.current;

        player.stop()
        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Song skipped by ${message.author.username}`)
            .setDescription(`${title} successfully skipped!`)
        );
    }
}


