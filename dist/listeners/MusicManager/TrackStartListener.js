"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Util_1 = __importDefault(require("../../lib/util/Util"));
class TrackStartListener extends discord_akairo_1.Listener {
    constructor() {
        super('trackStart', {
            emitter: 'musicManager',
            event: 'trackStart'
        });
    }
    exec(player, track) {
        var _a;
        const channel = this.client.channels.cache.get(player.textChannel);
        channel.send(new this.client.embed().setMain()
            .setTitle('Now Playing:')
            .setDescription([
            `Song Name: [${track.title}](${track.uri})`,
            `Uploader: ${track.author}`,
            `Duration: ${(_a = Util_1.default.msConversion(track.duration)) === null || _a === void 0 ? void 0 : _a.string}`
        ].join('\n'))
            .setThumbnail(track.thumbnail));
    }
}
exports.default = TrackStartListener;
