const Discord = require("discord.js");
const { Command } = require("discord-akairo");

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

  exec(message: any, args: any) {
    if (args.tasks && args.proxies) {
      const delayEmbed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(
          `Our recommended delay is ${(
            3500 /
            (args.proxies / args.tasks)
          ).toFixed(0)}ms`
        );

      return message.channel.send(delayEmbed);
    }
  }
}

module.exports = DelayCommand;
export {};
