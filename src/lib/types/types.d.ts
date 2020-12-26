import MoosicEmbed from '@lib/extensions/MoosicEmbed';
import { Manager } from 'erela.js';
import { Logger } from '@utils/Logger';

import "discord-akairo";
import NowPlayingCache from "@utils/MusicUtilClasses/NowPlayingCache";

declare module 'discord-akairo' {
    interface AkairoClient {
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        inhibitorHandler: InhibitorHandler;
        musicManager: Manager;
        readonly embed: typeof MoosicEmbed;
        logger: Logger;
        NowPlayingCache: NowPlayingCache;
    }
}

declare module 'discord.js' {
    interface MessageEmbed {
        setMain(): this;
        setSuccess(): this;
        setFailure(): this;
        setCaution(): this;
        addEmptyField(inline?: Boolean): this;
    }
}
