import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';
import Utils from '../../lib/util/Util';

export default class PlayCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play'],
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'restContent'
                }
            ],
            description: {
                content: 'Plays a requested song from youtube, soundcloud or spotify',
                usage: '<URL | Search Term>'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { query }: args) {

        const guild = message.guild!.id;
        const txtChannel = message.channel.id;
        const voiChannel = message.member?.voice.channel?.id;

        if (!voiChannel) return message.reply('cannot find your voice channel')
        if (!query) return message.reply('please supply a songname or URL')

        const player: Player = this.client.musicManager.create({
            guild: guild,
            selfDeafen: true,
            textChannel: txtChannel,
            voiceChannel: voiChannel
        });
        if (player.state !== 'CONNECTED') player.connect();

        let res;
        try {
            res = await player.search(query, message.author);
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw res.exception;
            }
        } catch (err) {
            return message.reply(`an error occurred whilst searching: \`\`${err}\`\``)
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if(!player.queue.current) player.destroy();
                return message.reply(`could not find any results for: \`\`${query}\`\``);
            case 'TRACK_LOADED':
                let isQueue = player.queue.current ? true : false;
                player.queue.add(res.tracks[0]);
                if(!player.playing && !player.queue.size && !player.paused) player.play();
                if(isQueue) {
                    return message.channel.send(new this.client.embed().setMain()
                        .setTitle(`Song request from ${message.author.username}`)
                        .setDescription(
                            [
                                `Song Name: [${res.tracks[0].title}](${res.tracks[0].uri})`,
                                `Uploader: ${res.tracks[0].author}`,
                                `Duration: ${Utils.msConversion(res.tracks[0].duration)?.string}`
                            ].join('\n')
                        )
                        .setThumbnail(res.tracks[0].thumbnail)
                    );
                }
                return;
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
                return message.channel.send(new this.client.embed().setMain()
                    .setTitle(`Playlist request from ${message.author.username}`)
                    .setDescription(
                        [
                            `Playlist Name: [${res.playlist.title || 'No name found'}](${query})`,
                            `Number of Tracks: ${res.tracks.length}`,
                            `Duration: ${Utils.msConversion(res.playlist.duration)?.string}`
                        ].join('\n')
                    )
                    .setThumbnail(res.tracks[0].thumbnail)
                );
            case 'SEARCH_RESULT':
                let maxResults:number = 5, filter = (m) => m.author.id && /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < maxResults) maxResults = res.tracks.length;

                const results:string = res.tracks
                    .slice(0, maxResults)
                    .map((track, index) => `${++index} - ${track.title}`)
                    .join('\n')
                message.channel.send(new this.client.embed().setMain()
                    .setTitle(`Showing results for: ${query}`)
                    .setDescription(results)
                    .setFooter('Type \'cancel\' to cancel this search result - results timeout in 30 seconds')
                );

                await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] })
                .then((collected) => {
                    if (collected.first()?.content === 'cancel') {
                        if (!player.queue.current) player.destroy();
                        return message.reply('cancelled selection')
                    }

                    const index:number = Number(collected.first()!.content) - 1;
                    if (index < 0 || index > maxResults - 1) return message.reply(`please provide a valid result selection (1 - ${maxResults})`);

                    const track = res.tracks[index];
                    let isQueue = player.queue.current ? true : false;
                    player.queue.add(track);
                    if (!player.playing && !player.paused && !player.queue.size) player.play()
                    if (isQueue) {
                        return message.channel.send(new this.client.embed().setMain()
                            .setTitle(`Song request from ${message.author.username}`)
                            .setDescription(
                                [
                                    `Song Name: [${track.title}](${track.uri})`,
                                    `Uploader: ${track.author}`,
                                    `Duration: ${Utils.msConversion(track.duration)?.string}`
                                ].join('\n')
                            )
                            .setThumbnail(track.thumbnail)
                        );
                    }
                    return;

                }).catch(() => {
                    message.reply('you took to long to make a selection')
                });
            break;


        }

    }

}

type args = {
    query: string
}


