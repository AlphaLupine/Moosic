import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class ResumeCommand extends Command {
    constructor() {
        super('resume', {
            aliases: ['resume'],
            description: {
                content: 'Resumes the current track'
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

        if (!player.queue.current) return message.reply('there is no music to pause')

        if (!player.paused) {
            return message.channel.send("The player isn't paused.")
        }

        player.pause(false);
        message.channel.send(new this.client.embed().setMain()
            .setTitle(`Player resumed by ${message.author.username}`)
            .setDescription(`Music Resumed!`)
        )
    }
}


