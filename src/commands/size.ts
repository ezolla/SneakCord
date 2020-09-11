// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
const converter = require("shoe-size-converter");

class SizeCommand extends Command {
  constructor() {
    super("size", {
      aliases: ["size", "sizes"],
      args: [
        {
          id: "system",
          type: "string",
        },
        {
          id: "size",
          type: "number",
        },
      ],
    });
  }

  exec(message: Message, args: any) {
    if (args.system && args.size) {
      // Calculating size results
      const results = calculateSizes(args.system, args.size);

      // Structuring embed
      const embed = new Discord.MessageEmbed().setColor("#5761C9").addFields(
        {
          name: "US",
          value: results.us,
          inline: true,
        },
        {
          name: "CA",
          value: results.ca,
          inline: true,
        },
        {
          name: "UK",
          value: results.uk,
          inline: true,
        },
        {
          name: "AU",
          value: results.au,
          inline: true,
        },
        {
          name: "EU",
          value: results.eu,
          inline: true,
        },
        {
          name: "BR",
          value: results.br,
          inline: true,
        },
        {
          name: "CM.",
          value: results.cm,
          inline: true,
        },
        {
          name: "IN.",
          value: results.in,
          inline: true,
        }
      );

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Size help");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = SizeCommand;
export {};

// Calculates size results
const calculateSizes = (system: string, size: number) => {
  // Desired regions
  const regions = ["us", "ca", "uk", "au", "eu", "br", "cm", "in"];

  // Calculating results
  const result = converter(system.toLowerCase(), "M", size, regions);

  // Returning results
  return result;
};
