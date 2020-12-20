"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlackListMember extends discord_akairo_1.Inhibitor {
    constructor() {
        super('blacklistM', {
            reason: 'blacklistM'
        });
    }
    exec(message) {
        const blacklist = [''];
        return blacklist.includes(message.guild.id);
    }
}
exports.default = BlackListMember;
