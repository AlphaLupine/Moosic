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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ShuffleCommand extends discord_akairo_1.Command {
    constructor() {
        super('shuffle', {
            aliases: ['shuffle', 'jumble'],
            description: {
                content: 'Shuffles the current queue'
            },
            category: 'music'
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
                return message.reply('I cannot find you voice channel');
            if (voiChannel.id !== player.voiceChannel)
                return message.reply('You are not in my voice channel');
            if (!player.queue.current)
                return message.reply('there is no music to shuffle');
            if (player.queue.size < 2)
                return message.reply('there is only one song in the queue');
            player.queue.shuffle();
            return message.channel.send(new this.client.embed().setMain()
                .setTitle(`Queue shuffled by ${message.author.username}`)
                .setDescription('Queue successfully shuffled!'));
        });
    }
}
exports.default = ShuffleCommand;
