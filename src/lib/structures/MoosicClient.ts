import {
  AkairoClient,
  ListenerHandler,
  CommandHandler,
  InhibitorHandler,
} from "discord-akairo";
import { join } from "path";
import { Manager, NodeOptions } from "erela.js";
import Spotify from "erela.js-spotify";
import MoosicEmbed from "../extensions/MoosicEmbed";
import { Logger } from "@nedbot/logger";
import { NodeIdentifiers } from "../util/Constants";
import NowPlayingCache from "../util/MusicUtilClasses/NowPlayingCache";



export default class MoosicClient extends AkairoClient {
    public logger = new Logger({
        logFileDirectory: "./logs",
        infoLogFileName: "moosic.log",
        errorLogFileName: "error.log",
        enableConsoleLogs: true,
        enableInfoLogs: true,
        enableErrorLogs: true
    });
    public readonly embed = MoosicEmbed;
    public NowPlayingCache = new NowPlayingCache();

    public listenerHandler = new ListenerHandler(this, {
        directory: join(process.cwd(), "dist", "listeners")
    });

    public commandHandler = new CommandHandler(this, {
        directory: join(process.cwd(), "dist", "commands"),
        prefix: "$",
        allowMention: true,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, text) => new MoosicEmbed().setMain().setDescription(text).setFooter("Type 'cancel' to cancel this prompt."),
                modifyRetry: (_, text) => new MoosicEmbed().setMain().setDescription(text).setFooter("Type 'cancel' to cancel this prompt."),
                modifyEnded: () => new MoosicEmbed().setMain().setDescription("You exceeded the retries threshold, so I've cancelled the prompt."),
                modifyCancel: () => new MoosicEmbed().setMain().setDescription("Cancelled the prompt successfully."),
                timeout: new MoosicEmbed().setMain().setDescription("You took a bit long there, so I've cancelled the prompt."),
                time: 15e3,
                retries: 3
            },
            otherwise: ""
        },
        commandUtil: true,
        handleEdits: true,
    });

    public inhibitorHandler = new InhibitorHandler(this, {
        directory: join(process.cwd(), "dist", "inhibitors")
    });

    public musicManager = new Manager({
        nodes: this.createNodes(NodeIdentifiers),
        plugins: [
            new Spotify({
                clientID: process.env.SPOTIFYCID!,
                clientSecret: process.env.SPOTIFYCS!
            })
        ],
        send: (id, payload) => {
            const guild = this.guilds.cache.get(id);
            if (guild) {
                guild.shard.send(payload);
            }
        },
    });

    public constructor() {
        super(
            {
                ownerID: process.env.OWNERIDS?.split(","),
            },
            {
                disableMentions: "everyone",
            }
        );
    }

    public run() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            musicManager: this.musicManager,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();

        return this.login(process.env.TOKEN)
    }

    public createNodes(names: string[]) {
        const nodes: NodeOptions[] = [];
        for(const name of names) {
            const node = {
                identifier: name,
                host: process.env.NODES_HOST!,
                port: Number(process.env.NODES_PORT) ?? 2333,
                password: process.env.NODES_PASS
            }
            nodes.push(node)
        }
        return nodes
    }
}
