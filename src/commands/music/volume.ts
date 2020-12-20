import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class VolumeCommand extends Command {
    constructor() {
        super('volume', {
            aliases: ['volume', 'vol'],
            args: [
                {
                    id: 'volume',
                    type: 'number'
                }
            ],
            description: {
                content: 'Alters the volume of the player',
                usage: '[volume]'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { volume }: args) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');
        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');

        if(!volume) return message.reply(`current volume of music player ${player.volume}`);
        if (volume < 1 || volume > 100) return message.reply('Volume can only be changed from 1-100%');

        player.setVolume(volume);

        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Volume changed by ${message.author.username}`)
            .setDescription(`Volume set to ${volume}`)
        )


    }
}

type args = {
    volume:number
}


