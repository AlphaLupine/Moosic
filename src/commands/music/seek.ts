import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';
import parse from "parse-duration";
import Utils from "../../lib/util/Util";

export default class SeekCommand extends Command {
    constructor() {
        super('seek', {
            aliases: ['seek'],
            args: [
                {
                    id: "toSeek",
                    type: "string",
                    match: "restContent"
                }
            ],
            description: {
                content: 'Seeks to a specified time in the song'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { toSeek }: args) {
        if(!toSeek) return message.reply ("please specify where I should seek to");

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) return message.reply('there is no player in this guild');

        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');

        if (!player.queue.current) return message.reply('there is no music to seek')

        const { duration } = player.queue.current;
        const seekFormatted = parse(toSeek, "ms");
        if(seekFormatted! > duration! || seekFormatted! <= 0) return message.reply("your seek time is out of range of the current song's duration");
        player.seek(seekFormatted!);

        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Seeking as requested by ${message.author.username}`)
            .setDescription(`Successfully seeked to: ${Utils.msConversion(seekFormatted)?.string}`)
        )
    }
}
type args = {
    toSeek:string
}


