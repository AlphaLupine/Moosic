import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import MoosicEmbed from '../../lib/extensions/MoosicEmbed';

export default class PlayCommand extends Command {
    constructor() {
        super('lyrics', {
            aliases: ['lyrics'],
            description: {
                content: 'Attempts to find lyrics for the current track',
            },
            category: 'music',
            args: [
                {
                    id: "song",
                    type: "string",
                    match: "content", // allow multiple arguments
                    default: (msg: Message) => {
                        const player = this.client.musicManager.get(msg.guild!.id)
                        return player?.queue.current?.title ?? null;
                    },
                    prompt: {
                        start: "Please provide a search query.",
                        optional: true   
                    },
                }
            ]
        });
    }

    async exec(message: Message, { song }: { song: string; }) {
        const json = await (
            await fetch(
                `https://some-random-api.ml/lyrics?title=${encodeURIComponent(song)}`
                )
        ).json();

        if (json.error) {
            return message.util!.reply("I couldn't find anything for that song.");
        }

        return message.util!.send(
            new MoosicEmbed()
                .setMain()
                .setAuthor(
                    json.title, 
                    json.thumbnail.genius, 
                    json.links.genius
                )
                .setDescription(json.lyrics.substring(0, 2000))
        );
    }
}
