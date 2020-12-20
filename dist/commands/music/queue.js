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
class QueueCommand extends discord_akairo_1.Command {
    constructor() {
        super('queue', {
            aliases: ['queue', 'que'],
            args: [
                {
                    id: 'pageNum',
                    type: 'number'
                }
            ],
            description: {
                content: 'Displays the current queue',
                usage: '[page]'
            },
            category: 'music'
        });
    }
    exec(message, { pageNum }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild.id;
            const voiChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            const player = this.client.musicManager.get(guild);
            if (!player)
                message.reply('there is no player in this guild');
            if (!voiChannel)
                return message.reply('I cannot find you voice channel');
            if (voiChannel.id !== player.voiceChannel)
                return message.reply('You are not in my voice channel');
            if (!player.queue.current)
                return message.reply('there is no music queue');
            const queue = player.queue;
            const queueEmbed = new this.client.embed().setMain()
                .setTitle(`Current queue for ${message.guild.name}`);
            const limit = 8;
            const page = pageNum ? pageNum : 1;
            const end = page * limit;
            const start = end - limit;
            const tracks = queue.slice(start, end);
            queueEmbed.addField(`Currently Playing:`, `[${queue.current.title}](${queue.current.uri})`);
            if (!tracks.length)
                queueEmbed.setDescription(`No tracks present in ${page < 1 ? `page ${page}` : 'the queue'}`);
            else
                queueEmbed.setDescription(tracks.map((track, i) => { var _a; return `${start + (++i)} - [${track.title}](${track.uri}) - ${(_a = Util_1.default.msConversion(track.duration)) === null || _a === void 0 ? void 0 : _a.string}`; }).join('\n'));
            const maxPages = Math.ceil(queue.length / limit);
            queueEmbed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
            return message.channel.send(queueEmbed);
        });
    }
}
exports.default = QueueCommand;
