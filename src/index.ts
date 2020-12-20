import MoosicClient from './lib/structures/MoosicClient';
import { CommandHandler } from 'discord-akairo';

import dotenv from 'dotenv';
dotenv.config();

const client = new MoosicClient();
client.login(process.env.Token)

declare module 'discord.js' {
    interface Client {
        commandHandler: CommandHandler
    }
}

    

