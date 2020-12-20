import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default class PlayCommand extends Command {
    constructor() {
        super('lyrics', {
            aliases: ['lyrics'],
            description: {
                content: 'Attempts to find lyrics for the current track',
            },
            category: 'music',
        });
    }

    async exec(message: Message) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');

        if (!voiChannel) return message.reply('I cannot find your voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');

        if (!player.queue.current) return message.reply('there is no music to find the lyrics of')

        let songName = player.queue.current.title;

        const lyricEmbed = new this.client.embed().setMain()
            .setTitle(`Lyrics for ${songName}`)
            .setFooter(`Lyrics are scraped from the web - results may not be 100% accurate`)

        try {
            songName = songName
                .toLowerCase()
                .replace(/(official)?(lyrics?)?(hd)?(videos?)?(clip)?(extended)?(reupload)?/gi, "").trim()
                .split(' ').join('%20');
            let res = await fetch(`https://www.musixmatch.com/search/${songName}`);
            res = await res.text();
            let $ = await cheerio.load(res);
            const songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

            res = await fetch(songLink);
            res = await res.text();
            $ = await cheerio.load(res);

            let lyrics:string = await $('p[class=\"mxm-lyrics__content \"]').text();

            if (!lyrics.length) return message.channel.send(lyricEmbed.setDescription('No lyrics found'));

            message.channel.send(lyricEmbed.setDescription(
                    lyrics.length > 2048 ? `Could not fit lyrics into message, please click: [here](https://www.musixmatch.com/search/${songName})` : lyrics
                )
            );
        } catch (err) {
            this.client.logger.info('Could not scrape lyrics');
            return message.channel.send(lyricEmbed.setDescription('No lyrics found'));
        }

    }
}
