"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class RawListener extends discord_akairo_1.Listener {
    constructor() {
        super('raw', {
            emitter: 'client',
            event: 'raw'
        });
    }
    exec(data) {
        this.client.musicManager.updateVoiceState(data);
    }
}
exports.default = RawListener;
