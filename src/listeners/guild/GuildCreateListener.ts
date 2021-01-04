import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

export default class GuildCreateListener extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    exec(guild:Guild) {
        this.client.logger.info("GuildCreate",`${this.client.user!.username} just joined a new Guild: ${guild.name} | ${guild.id}`);
    }
}