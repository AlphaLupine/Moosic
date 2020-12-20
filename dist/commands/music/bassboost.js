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
const levels = {
    none: 0.0,
    low: 0.10,
    med: 0.15,
    high: 0.25,
};
class BassBoostCommand extends discord_akairo_1.Command {
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
    exec(message, { value }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild.id;
            const voiChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            const player = this.client.musicManager.get(guild);
            if (!player)
                return message.reply('there is no player in this guild');
            if (!voiChannel)
                return message.reply('I cannot find you voice channel');
            if (voiChannel.id !== player.voiceChannel)
                return message.reply('You are not in my voice channel');
            if (!player.queue.current)
                return message.reply('there is no music to bassboost');
            let level = 'none';
            if (value && value.toLowerCase() in levels)
                level = value.toLowerCase();
            const bands = new Array(3)
                .fill(null)
                .map((_, i) => ({ band: i, gain: levels[level] }));
            player.setEQ(...bands);
            return message.channel.send(new this.client.embed().setMain()
                .setTitle(`Bass altered by ${message.author.username}`)
                .setDescription(`The bassboost level has been set to ${level}!`));
        });
    }
}
exports.default = BassBoostCommand;
