import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class PauseCommand extends Command {
    constructor() {
        super('pause', {
            aliases: ['pause'],
            description: {
                content: 'Pauses the current track'
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

        player.pause(true);
        message.channel.send(new this.client.embed().setMain()
            .setTitle(`Player paused by ${message.author.username}`)
            .setDescription(`Music Paused!`)
        )
    }
}


