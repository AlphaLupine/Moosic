"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const path_1 = require("path");
const erela_js_1 = require("erela.js");
const erela_js_spotify_1 = __importDefault(require("erela.js-spotify"));
const MoosicEmbed_1 = __importDefault(require("../extensions/MoosicEmbed"));
const Logger_1 = require("../util/Logger");
class MoosicClient extends discord_akairo_1.AkairoClient {
    constructor() {
        var _a;
        super({
            ownerID: (_a = process.env.OWNERIDS) === null || _a === void 0 ? void 0 : _a.split(',')
        }, {
            disableMentions: 'everyone'
        });
        this.embed = MoosicEmbed_1.default;
        this.logger = new Logger_1.Logger();
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(process.cwd(), 'dist', 'listeners')
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path_1.join(process.cwd(), 'dist', 'commands'),
            prefix: '$',
            commandUtil: true,
            allowMention: true,
            handleEdits: true
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path_1.join(process.cwd(), 'dist', 'inhibitors')
        });
        const client = this;
        this.musicManager = new erela_js_1.Manager({
            nodes: [
                {
                    host: process.env.NODES_HOST,
                    port: 2333,
                    password: process.env.NODES_PASS
                },
            ],
            plugins: [
                new erela_js_spotify_1.default({
                    clientID: process.env.SPOTIFYCID,
                    clientSecret: process.env.SPOTIFYCS
                })
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild)
                    guild.shard.send(payload);
            }
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler,
            musicManager: this.musicManager
        });
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();
    }
}
exports.default = MoosicClient;
