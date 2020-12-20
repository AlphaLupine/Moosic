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
class RemoveCommand extends discord_akairo_1.Command {
    constructor() {
        super('remove', {
            aliases: ['remove'],
            args: [
                {
                    id: 'toRemove',
                    type: 'string'
                }
            ],
            description: {
                content: 'Removes a song from the queue',
                usage: '<song number|all>'
            },
            category: 'music'
        });
    }
    exec(message, { toRemove }) {
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
                return message.reply('there is no music to remove');
            if (toRemove.length && /all/i.test(toRemove)) {
                player.queue.clear();
                return message.channel.send(new this.client.embed().setMain()
                    .setTitle(`Queue cleared by ${message.author.username}`)
                    .setDescription(`Successfully cleared the queue!`));
            }
            const track = Number(toRemove);
            if (!track)
                return message.reply('Please specify a track to remove');
            if (!player.queue.size || track > player.queue.size)
                return message.reply(`There is no track "${track}" in the queue`);
            let removedTrack = player.queue.remove(track - 1);
            return message.channel.send(new this.client.embed().setMain()
                .setTitle(`Queue altered by ${message.author.username}`)
                .setDescription(`Successfully removed \`\`${removedTrack[0].title}\`\` from the queue`));
        });
    }
}
exports.default = RemoveCommand;
