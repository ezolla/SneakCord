// Import
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";

const discordEpoch = 1420070400000;

class TimestampCommand extends Command {
  constructor() {
    super("timestamp", {
      aliases: ["timestamp", "snowflake", "time-stamp", "snow-flake"],
      args: [
        {
          id: "timestamp",
          type: "string",
        },
      ],
    });
  }

  exec(message: Message, args: any) {
    // Validating argument
    if (args.timestamp) {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .addFields(
          { name: "Unix", value: getUnixTimestamp(args.timestamp) },
          { name: "ISO 8601", value: getIsoTimestamp(args.timestamp) }
        );

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give timestamp");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = TimestampCommand;
export {};

// Converts to UNIX timestamp
const getUnixTimestamp = (timestamp: any) => {
  const id = BigInt.asUintN(64, timestamp);
  const dateBits = Number(id >> 22n);

  const unix = dateBits + discordEpoch;

  // Returning converted timestamp
  return unix.toString();
};

// Converts to ISO timestamp
const getIsoTimestamp = (timestamp: any) => {
  const id = BigInt.asUintN(64, timestamp);
  const dateBits = Number(id >> 22n);

  const unix = dateBits + discordEpoch;
  const iso = new Date(unix).toISOString();

  // Returning converted timestamp
  return iso;
};
