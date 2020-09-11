// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping", "alive", "bot"],
      args: [
        {
          id: "url",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    // Validating url argument
    if (args.url === undefined) {
      // Create bot ping embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(":ping_pong: Pong!");

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else if (
      args.url !== null &&
      (args.url.startsWith("http") || args.url.contains("www."))
    ) {
      // Checking site status
      const response = await fetch(args.url, {
        method: "GET",
        headers: {
          "User-Agent": randomUseragent.getRandom()!,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response) {
        // Create website ping embed
        const embed = new Discord.MessageEmbed()
          .setColor("#5761C9")
          .setTitle(`Site status is ${response.status}`);

        // Sending embed to requester channel
        return message.channel.send(embed);
      }
    } else {
      // Create bot ping embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(":ping_pong: Pong!");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = PingCommand;
export {};
