import MoosicClient from './lib/structures/MoosicClient';
import { CommandHandler } from 'discord-akairo';

const client = new MoosicClient();
client.login(process.env.Token)

declare module 'discord.js' {
    interface Client {
        commandHandler: CommandHandler
    }
}

    

