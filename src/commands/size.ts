const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const converter = module.require("shoe-size-converter");

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

  exec(message: any, args: any) {
    if (args.system && args.size) {
      const results = calculateSizes(args.system, args.size);

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

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Must provide system and size");

      return message.channel.send(embed);
    }
  }
}

module.exports = SizeCommand;
export {};

const calculateSizes = (system: string, size: number) => {
  // Desired regions
  const regions = ["us", "ca", "uk", "au", "eu", "br", "cm", "in"];

  // Calculating results
  const result = converter(system.toLowerCase(), "M", size, regions);

  // Returning results
  return result;
};
