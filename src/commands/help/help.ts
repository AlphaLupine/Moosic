import { Command, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';
import Util  from '../../lib/util/Util';

export default class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'halp'],
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ],
            description: {
                content: 'Displays a list of usable commands',
                usage: '[command]'
            },
            category: 'help'
        });
    }

    async exec(message: Message, { command }: args) {
        const prefix = await (this.handler.prefix as PrefixSupplier);
        if(!command) {
            const embed = new this.client.embed().setMain()
                .addField('Commands', `My prefix is ${prefix} `)
                .setFooter(`Use ${prefix}help <command> for extended help`);
            for (const category of this.handler.categories.values()) {
                if(category.id !== 'developer') {
                    embed.addField(`❯ ${Util.toCapitalise(category.id)}`, `${category.filter((cmd) => cmd.aliases.length > 0).map((cmd):string => `\`${cmd.aliases[0]}\``).join(' ')}`);
                }
            }
            return message.channel.send(embed);
        }

        if (command.ownerOnly) return;
        const embed = new this.client.embed().setMain()
            .setTitle(`\`${prefix}${command.aliases[0]}\` \`${command.description.usage ? command.description.usage : ''}\``)
            .addField('Description:' , `${command.description.content ? command.description.content : 'None provided'}`)
            .setFooter('Required Arguments <> | Optional Arguments []')
        if (command.aliases.length > 1) embed.addField('Aliases:', `\`${command.aliases.join('|')}\``);
        return message.channel.send(embed);
    }
}

type args = {
    command:Command
}


