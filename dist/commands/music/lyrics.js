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
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
class PlayCommand extends discord_akairo_1.Command {
    constructor() {
        super('lyrics', {
            aliases: ['lyrics'],
            description: {
                content: 'Attempts to find lyrics for the current track',
            },
            category: 'music',
        });
    }
    exec(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild.id;
            const voiChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            const player = this.client.musicManager.get(guild);
            if (!player)
                message.reply('there is no player in this guild');
            if (!voiChannel)
                return message.reply('I cannot find your voice channel');
            if (voiChannel.id !== player.voiceChannel)
                return message.reply('You are not in my voice channel');
            if (!player.queue.current)
                return message.reply('there is no music to find the lyrics of');
            let songName = player.queue.current.title;
            const lyricEmbed = new this.client.embed().setMain()
                .setTitle(`Lyrics for ${songName}`)
                .setFooter(`Lyrics are scraped from the web - results may not be 100% accurate`);
            try {
                songName = songName
                    .toLowerCase()
                    .replace(/(official)?(lyrics?)?(hd)?(videos?)?(clip)?(extended)?(reupload)?/gi, "").trim()
                    .split(' ').join('%20');
                let res = yield node_fetch_1.default(`https://www.musixmatch.com/search/${songName}`);
                res = yield res.text();
                let $ = yield cheerio_1.default.load(res);
                const songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;
                res = yield node_fetch_1.default(songLink);
                res = yield res.text();
                $ = yield cheerio_1.default.load(res);
                let lyrics = yield $('p[class=\"mxm-lyrics__content \"]').text();
                if (!lyrics.length)
                    return message.channel.send(lyricEmbed.setDescription('No lyrics found'));
                message.channel.send(lyricEmbed.setDescription(lyrics.length > 2048 ? `Could not fit lyrics into message, please click: [here](https://www.musixmatch.com/search/${songName})` : lyrics));
            }
            catch (err) {
                this.client.logger.info('Could not scrape lyrics');
                return message.channel.send(lyricEmbed.setDescription('No lyrics found'));
            }
        });
    }
}
exports.default = PlayCommand;
