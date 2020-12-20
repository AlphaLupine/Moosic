"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }
    exec() {
        var _a;
        const prefix = this.client.commandHandler.prefix;
        this.client.musicManager.init(this.client.user.id);
        this.client.logger.log(`${this.client.user.username} is ready`);
        (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`${prefix}help`, { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO' });
    }
}
exports.default = ReadyListener;
