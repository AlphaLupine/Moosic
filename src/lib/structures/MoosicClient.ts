import { AkairoClient, ListenerHandler, CommandHandler, InhibitorHandler }  from 'discord-akairo';
import { join } from 'path';
import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';
import MoosicEmbed from '../extensions/MoosicEmbed';
import { Logger } from '../util/Logger';

declare module "discord-akairo" {
    interface AkairoClient {
        musicManager: Manager;
        listenerHandler: ListenerHandler;
        commandHandler: CommandHandler;
        inhibitorHandler: InhibitorHandler;
        readonly embed: typeof MoosicEmbed
        logger: Logger
    }
}

export default class MoosicClient extends AkairoClient {

    public listenerHandler:ListenerHandler;
    public commandHandler:CommandHandler;
    public inhibitorHandler:InhibitorHandler;
    public musicManager:Manager;
    public readonly embed = MoosicEmbed;
    public logger = new Logger();

    constructor() {
        super({
            ownerID: process.env.OWNERIDS?.split(',')
        }, {
            disableMentions: 'everyone'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(process.cwd(), 'dist', 'listeners')
        });

        this.commandHandler = new CommandHandler(this, {
            directory: join(process.cwd(), 'dist', 'commands'),
            prefix: '$',
            commandUtil: true,
            allowMention: true,
            handleEdits: true,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, text) => new MoosicEmbed().setMain().setDescription(text).setFooter("Type 'cancel' to cancel this prompt."),
                    modifyRetry: (_, text) => new MoosicEmbed().setMain().setDescription(text).setFooter("Type 'cancel' to cancel this prompt."),
                    modifyEnded: () => new MoosicEmbed().setMain().setDescription("You exceeded the retries threshold, so I've cancelled the prompt."),
                    modifyCancel: () => new MoosicEmbed().setMain().setDescription("Cancelled the prompt successfully."),
                    modifyTimeout: () => new MoosicEmbed().setMain().setDescription("You took a bit long there, so I've cancelled the prompt."),
                    time: 15e3,
                    retries: 3
                },
                otherwise: ""
            }
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(process.cwd(), 'dist', 'inhibitors')
        });

        const client = this;
        this.musicManager = new Manager({
            nodes: [
                {
                    host: process.env.NODES_HOST!,
                    port: Number(process.env.NODES_PORT),
                    password: process.env.NODES_PASS!
                },
            ],
            plugins: [
                new Spotify({
                    clientID: process.env.SPOTIFYCID!,
                    clientSecret: process.env.SPOTIFYCS!
                })
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
        })

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler,
            musicManager: this.musicManager
        })

        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();
        
    }
}