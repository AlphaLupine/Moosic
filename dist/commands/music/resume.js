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
class ResumeCommand extends discord_akairo_1.Command {
    constructor() {
        super('resume', {
            aliases: ['resume'],
            description: {
                content: 'Resumes the current track'
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
                return message.reply('there is no music to pause');
            player.pause(false);
            message.channel.send(new this.client.embed().setMain()
                .setTitle(`Player resumed by ${message.author.username}`)
                .setDescription(`Music Resumed!`));
        });
    }
}
exports.default = ResumeCommand;
