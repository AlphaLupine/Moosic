import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlackListGuild extends Inhibitor {
    constructor() {
        super('blacklistG', {
            reason: 'blacklistG'
        })
    }

    exec(message: Message) {

        const blacklist = [''] //Sync to a DB
        return blacklist.includes(message.guild!.id);
    }
}