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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const util_1 = require("util");
class EvalCommand extends discord_akairo_1.Command {
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
                    flag: ['-d=', '--depth='],
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
    exec(message, { code, Depth, toAsync, isSilent }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const depth = Depth;
            const format = (code) => ['```ts', code, '```'].join('\n');
            const embed = new this.client.embed().addField('**Input:**', format(code));
            let toEval = code;
            if (toAsync)
                toEval = `(async () => { ${code} })();`;
            try {
                const evaluated = yield eval(toEval);
                if (isSilent)
                    return;
                let output = util_1.inspect(evaluated, { depth });
                if (output.length < 1000) {
                    embed.setSuccess().addField('**Output**', format(output.replace(this.client.token, 'BRUH')));
                    return message.channel.send(embed);
                }
                else {
                    const attachment = new discord_js_1.MessageAttachment(Buffer.from(evaluated), 'evaluation.txt');
                    return message.channel.send({ files: [attachment] });
                }
            }
            catch (err) {
                const full = (_a = err.stack) !== null && _a !== void 0 ? _a : err;
                if (full.length < 1000) {
                    embed.setFail().addField('**Error**', format(full));
                    return message.channel.send(embed);
                }
                else {
                    const attachment = new discord_js_1.MessageAttachment(Buffer.from(full), 'evaluation.txt');
                    return message.channel.send({ files: [attachment] });
                }
            }
        });
    }
}
exports.default = EvalCommand;
