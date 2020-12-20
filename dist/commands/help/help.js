"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Util_1 = __importDefault(require("../../lib/util/Util"));
class HelpCommand extends discord_akairo_1.Command {
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
    exec(message, { command }) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = yield this.handler.prefix;
            if (!command) {
                const embed = new this.client.embed().setMain()
                    .addField('Commands', `My prefix is ${prefix} `)
                    .setFooter(`Use ${prefix}help <command> for extended help`);
                for (const category of this.handler.categories.values()) {
                    if (category.id !== 'developer') {
                        embed.addField(`❯ ${Util_1.default.toCapitalise(category.id)}`, `${category.filter((cmd) => cmd.aliases.length > 0).map((cmd) => `\`${cmd.aliases[0]}\``).join(' ')}`);
                    }
                }
                return message.channel.send(embed);
            }
            const embed = new this.client.embed().setMain()
                .setTitle(`\`${prefix}${command.aliases[0]}\` \`${command.description.usage ? command.description.usage : ''}\``)
                .addField('Description:', `${command.description.content ? command.description.content : 'None provided'}`)
                .setFooter('Required Arguments <> | Optional Arguments []');
            if (command.aliases.length > 1)
                embed.addField('Aliases:', `\`${command.aliases.join('|')}\``);
            return message.channel.send(embed);
        });
    }
}
exports.default = HelpCommand;
