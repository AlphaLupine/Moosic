import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlackListMember extends Inhibitor {
    constructor() {
        super('blacklistM', {
            reason: 'blacklistM'
        })
    }

    exec(message:Message) {
        const blacklist = [''] //Sync to a DB
        return blacklist.includes(message.guild!.id);
    }
}