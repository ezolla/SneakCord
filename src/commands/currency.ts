// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
const currencyConverter = require("@techhof-ab/currency-converter");

class CurrencyCommand extends Command {
  constructor() {
    super("currency", {
      aliases: ["currency"],
      args: [
        {
          id: "from",
          type: "string",
        },
        {
          id: "to",
          type: "string",
        },
        {
          id: "amount",
          type: "number",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    if (!(args.from === null && args.to === null && args.amount === null)) {
      // Convert currency
      const result: any = await getConversion(args.from, args.to, args.amount);

      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle(result.conversion_amount);

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give argument");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = CurrencyCommand;
export {};

// Converts currency
const getConversion = async (from: string, to: string, amount: number) => {
  // Gets current date in 0000-00-00 format
  const date = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")
    .split(" ");

  // Converts currency
  const result = await currencyConverter(amount, from, to, date[0]);

  return result;
};
