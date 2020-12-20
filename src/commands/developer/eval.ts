import { Command } from 'discord-akairo';
import { Message, MessageAttachment } from 'discord.js';
import { inspect } from 'util';

export default class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            args: [
                {
                    id: 'code',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: 'Depth',
                    match: 'option',
                    type: 'number',
                    flag: ['-d=','--depth='],
                    default: 0
                },
                {
                    id: 'toAsync',
                    match: 'flag',
                    flag: '--async',
                },
                {
                    id: 'isSilent',
                    match: 'flag',
                    flag: ['-s', '--silent'],
                }
            ],
            description: {
                content: 'Evaluates Code',
                usage: '<code> [flags: depth|toAsync|isSilent]'
            },
            category: 'developer',
            ownerOnly: true
        });
    }

    async exec(message: Message, { code, Depth, toAsync, isSilent }: args) {
        const depth = Depth;
        const format = (code) => ['```ts', code , '```'].join('\n');
        const embed = new this.client.embed().addField('**Input:**', format(code));
        let toEval = code;
        if (toAsync) toEval = `(async () => { ${code} })();`;
        try {
            const evaluated = await eval(toEval);
            if (isSilent) return;
            let output = inspect(evaluated, { depth });
            if (output.length < 1000) {
                embed.setSuccess().addField('**Output**', format(output.replace(this.client.token!, 'BRUH')));
                return message.channel.send(embed);
            } else {
                const attachment = new MessageAttachment(Buffer.from(evaluated), 'evaluation.txt');
                return message.channel.send({files: [attachment]});
            }
        } catch (err) {
            const full = err.stack ?? err;
            if (full.length < 1000) {
                embed.setFail().addField('**Error**', format(full));
                return message.channel.send(embed);
            } else {
                const attachment = new MessageAttachment(Buffer.from(full), 'evaluation.txt');
                return message.channel.send({files: [attachment]});
            }
        }
    }
}

type args = {
    code:string
    Depth:number
    toAsync:boolean
    isSilent:boolean
}



