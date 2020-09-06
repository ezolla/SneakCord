// Imports
import Discord from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      args: [
        {
          id: "site",
          type: "string",
        },
      ],
    });
  }

  pingEmbed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(":ping_pong: Pong!");

  errorEmbed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Error occurred");

  exec(message: any, args: any) {
    if (!args) {
      return message.channel.send(this.pingEmbed);
    } else {
      // Checking for site argument
      if (
        args.site.startsWith("http://") ||
        args.site.startsWith("https://") ||
        args.site.contains("www.")
      ) {
        // Checking site status
        fetch(args.site)
          .then((res: any) => {
            return message.channel.send(createEmbed(res.status));
          })
          .catch(() => {
            return message.channel.send(this.errorEmbed);
          });
      }
    }
  }
}

module.exports = PingCommand;
export {};

const createEmbed = (status: number) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(`Site status is ${status}`);

  return embed;
};
