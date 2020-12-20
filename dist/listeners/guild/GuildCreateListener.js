"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class GuildCreateListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }
    exec(guild) {
        this.client.logger.info(`${this.client.user.username} just joined a new Guild: ${guild.name} | ${guild.id}`);
    }
}
exports.default = GuildCreateListener;
