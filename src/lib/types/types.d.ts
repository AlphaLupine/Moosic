import MoosicEmbed from '@lib/extensions/MoosicEmbed';
import { Manager } from 'erela.js';
import { Logger } from '@utils/Logger';

declare module 'discord-akairo' {
    interface AkairoClient {
        musicManager: Manager;
        readonly embed: typeof MoosicEmbed;
        logger: Logger;

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
