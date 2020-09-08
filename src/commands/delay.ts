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

  exec(message: Message, args: any) {
    if (args.tasks && args.proxies) {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(
          `Our recommended delay is ${(
            3500 /
            (args.proxies / args.tasks)
          ).toFixed(0)}ms`
        );

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Must provide # of tasks and proxies");

      return message.channel.send(embed);
    }
  }
}

module.exports = DelayCommand;
export {};
