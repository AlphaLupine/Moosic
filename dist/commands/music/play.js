"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Util_1 = __importDefault(require("../../lib/util/Util"));
class PlayCommand extends discord_akairo_1.Command {
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
    exec(message, { query }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild.id;
            const txtChannel = message.channel.id;
            const voiChannel = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel) === null || _b === void 0 ? void 0 : _b.id;
            if (!voiChannel)
                return message.reply('cannot find your voice channel');
            if (!query)
                return message.reply('please supply a songname or URL');
            const player = this.client.musicManager.create({
                guild: guild,
                selfDeafen: true,
                textChannel: txtChannel,
                voiceChannel: voiChannel
            });
            if (player.state !== 'CONNECTED')
                player.connect();
            let res;
            try {
                res = yield player.search(query, message.author);
                if (res.loadType === 'LOAD_FAILED') {
                    if (!player.queue.current)
                        player.destroy();
                    throw res.exception;
                }
            }
            catch (err) {
                return message.reply(`an error occurred whilst searching: \`\`${err}\`\``);
            }
            switch (res.loadType) {
                case 'NO_MATCHES':
                    if (!player.queue.current)
                        player.destroy();
                    return message.reply(`could not find any results for: \`\`${query}\`\``);
                case 'TRACK_LOADED':
                    player.queue.add(res.tracks[0]);
                    if (!player.playing && !player.queue.size && !player.paused)
                        player.play();
                    return message.channel.send(new this.client.embed().setMain()
                        .setTitle(`Song request from ${message.author.username}`)
                        .setDescription([
                        `Song Name: [${res.tracks[0].title}](${res.tracks[0].uri})`,
                        `Uploader: ${res.tracks[0].author}`,
                        `Duration: ${(_c = Util_1.default.msConversion(res.tracks[0].duration)) === null || _c === void 0 ? void 0 : _c.string}`
                    ].join('\n'))
                        .setThumbnail(res.tracks[0].thumbnail));
                case 'PLAYLIST_LOADED':
                    player.queue.add(res.tracks);
                    if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
                        player.play();
                    return message.channel.send(new this.client.embed().setMain()
                        .setTitle(`Playlist request from ${message.author.username}`)
                        .setDescription([
                        `Playlist Name: [${res.playlist.title || 'No name found'}](${query})`,
                        `Number of Tracks: ${res.tracks.length}`,
                        `Duration: ${(_d = Util_1.default.msConversion(res.playlist.duration)) === null || _d === void 0 ? void 0 : _d.string}`
                    ].join('\n'))
                        .setThumbnail(res.tracks[0].thumbnail));
                case 'SEARCH_RESULT':
                    let maxResults = 5, filter = (m) => m.author.id && /^(\d+|end)$/i.test(m.content);
                    if (res.tracks.length < maxResults)
                        maxResults = res.tracks.length;
                    const results = res.tracks
                        .slice(0, maxResults)
                        .map((track, index) => `${++index} - ${track.title}`)
                        .join('\n');
                    message.channel.send(new this.client.embed().setMain()
                        .setTitle(`Showing results for: ${query}`)
                        .setDescription(results)
                        .setFooter('Type \'cancel\' to cancel this search result - results timeout in 30 seconds'));
                    yield message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] })
                        .then((collected) => {
                        var _a, _b;
                        if (((_a = collected.first()) === null || _a === void 0 ? void 0 : _a.content) === 'cancel') {
                            if (!player.queue.current)
                                player.destroy();
                            return message.reply('cancelled selection');
                        }
                        const index = Number(collected.first().content) - 1;
                        if (index < 0 || index > maxResults - 1)
                            return message.reply(`please provide a valid result selection (1 - ${maxResults})`);
                        const track = res.tracks[index];
                        player.queue.add(track);
                        if (!player.playing && !player.paused && !player.queue.size)
                            player.play();
                        return message.channel.send(new this.client.embed().setMain()
                            .setTitle(`Song request from ${message.author.username}`)
                            .setDescription([
                            `Song Name: [${track.title}](${track.uri})`,
                            `Uploader: ${track.author}`,
                            `Duration: ${(_b = Util_1.default.msConversion(track.duration)) === null || _b === void 0 ? void 0 : _b.string}`
                        ].join('\n'))
                            .setThumbnail(track.thumbnail));
                    }).catch(() => {
                        message.reply('you took to long to make a selection');
                    });
                    break;
            }
        });
    }
}
exports.default = PlayCommand;
