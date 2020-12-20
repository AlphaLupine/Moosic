"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlackListGuild extends discord_akairo_1.Inhibitor {
    constructor() {
        super('blacklistG', {
            reason: 'blacklistG'
        });
    }
    exec(message) {
        const blacklist = [''];
        return blacklist.includes(message.guild.id);
    }
}
exports.default = BlackListGuild;
