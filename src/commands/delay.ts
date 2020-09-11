// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";

class DelayCommand extends Command {
  constructor() {
    super("delay", {
      aliases: ["delay"],
      args: [
        {
          id: "tasks",
          type: "number",
        },
        {
          id: "proxies",
          type: "number",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    if (args.tasks && args.proxies) {
      // Creates embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(
          `Our recommended delay is ${(
            3500 /
            (args.proxies / args.tasks)
          ).toFixed(0)}ms`
        );

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creates embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Delay help");

      return message.channel.send(embed);
    }
  }
}

module.exports = DelayCommand;
export {};
