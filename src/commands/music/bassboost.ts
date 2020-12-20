import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';


const levels = {
    none: 0.0,
    low: 0.10,
    med: 0.15,
    high: 0.25,
};

export default class BassBoostCommand extends Command {
    constructor() {
        super('bassboost', {
            aliases: ['bassboost', 'bass', 'bb'],
            args: [
                {
                    id: 'value',
                    type: 'string',
                }
            ],
            description: {
                content: 'Applies a bassboost effect to the player',
                usage: '[none|low|medium|high]'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { value }: args) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) return message.reply('there is no player in this guild');

        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');

        if (!player.queue.current) return message.reply('there is no music to bassboost')

        let level:string = 'none';
        if (value && value.toLowerCase() in levels) level = value.toLowerCase()
        const bands = new Array(3)
            .fill(null)
            .map((_, i) =>
                ({band: i, gain: levels[level]})
            );
        player.setEQ(...bands);
        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Bass altered by ${message.author.username}`)
            .setDescription(`The bassboost level has been set to ${level}!`)
        );
    }
}

type args = {
    value: string
}


