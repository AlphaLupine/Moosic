import { Command } from "discord-akairo";
import { Message } from "discord.js";
import Util from "../../lib/util/Util";

export default class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "halp"],
      args: [
        {
          id: "command",
          type: "commandAlias",
        },
      ],
      description: {
        content: "Displays a list of usable commands",
        usage: "[command]",
      },
      category: "help",
    });
  }

  async exec(message: Message, { command }: { command: Command }) {
    const prefix = this.handler.prefix; // this is a typeof string (as of now)
    const embed = new this.client.embed().setMain();

    if (!command) {
      for (const [name, category] of this.handler.categories.filter(
        (c) =>
          ![
            ...(this.client.ownerID.includes(message.author.id)
              ? "developer"
              : []),
          ].includes(c.id)
      )) {
        embed.addField(
          `❯ ${Util.toCapitalise(name)} (${category.size})`,
          category.map((alias) => `\`${alias}\``).join(", ")
        );
      }

      embed.setFooter(`Run ${prefix}help <command> for more infromation`);

      return message.channel.send(embed);
    }

    message.channel.send(
        embed.setTitle(
            `\`${prefix}${command.aliases[0]}\` \`${
            command.description.usage ?? ""
            }\``
        )
        .addField(`Description:`, command.description!.content ?? "No description provided")
        .setFooter("<> = Required, [] = Strict")
    );
  }
}