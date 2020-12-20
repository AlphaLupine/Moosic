import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Player } from 'erela.js';

export default class RemoveCommand extends Command {
    constructor() {
        super('remove', {
            aliases: ['remove'],
            args: [
                {
                    id: 'toRemove',
                    type: 'string'
                }
            ],
            description: {
                content: 'Removes a song from the queue',
                usage: '<song number|all>'
            },
            category: 'music'
        });
    }

    async exec(message: Message, { toRemove }: args) {

        const guild = message.guild!.id;
        const voiChannel = message.member?.voice.channel;

        const player: Player = this.client.musicManager.get(guild)!;
        if (!player) message.reply('there is no player in this guild');
        if (!voiChannel) return message.reply('I cannot find you voice channel');
        if (voiChannel.id !== player.voiceChannel) return message.reply('You are not in my voice channel');
        if (!player.queue.current) return message.reply('there is no music to remove');

        if (toRemove.length && /all/i.test(toRemove)) {
            player.queue.clear();
            return message.channel.send(new this.client.embed().setMain()
                .setTitle(`Queue cleared by ${message.author.username}`)
                .setDescription(`Successfully cleared the queue!`)
            )
        }

        const track = Number(toRemove);
        if (!track) return message.reply('Please specify a track to remove');
        if (!player.queue.size || track > player.queue.size ) return message.reply(`There is no track "${track}" in the queue`);

        let removedTrack = player.queue.remove(track-1);
        return message.channel.send(new this.client.embed().setMain()
            .setTitle(`Queue altered by ${message.author.username}`)
            .setDescription(`Successfully removed \`\`${removedTrack[0].title}\`\` from the queue`)
        )

    }
}

type args = {
    toRemove:string
}


