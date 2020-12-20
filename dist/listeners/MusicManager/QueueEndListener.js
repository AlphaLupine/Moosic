"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class QueueEndListener extends discord_akairo_1.Listener {
    constructor() {
        super('queueEnd', {
            emitter: 'musicManager',
            event: 'queueEnd'
        });
    }
    exec(player) {
        const channel = this.client.channels.cache.get(player.textChannel);
        channel.send(new this.client.embed().setMain()
            .setTitle('End Of Queue')
            .setDescription('I ran out of songs to play'));
        player.destroy();
    }
}
exports.default = QueueEndListener;
