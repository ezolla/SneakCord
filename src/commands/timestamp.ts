const Discord = require("discord.js");
const { Command } = require("discord-akairo");

const discordEpoch = 1420070400000;

class TimestampCommand extends Command {
  constructor() {
    super("timestamp", {
      aliases: ["timestamp", "snowflake"],
      args: [
        {
          id: "timestamp",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  exec(message: any, args: any) {
    if (args.timestamp) {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .addFields(
          { name: "Unix", value: getUnixTimestamp(args.timestamp) },
          { name: "ISO 8601", value: getIsoTimestamp(args.timestamp) }
        );

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give timestamp");

      return message.channel.send(embed);
    }
  }
}

module.exports = TimestampCommand;
export {};

const getUnixTimestamp = (timestamp: any) => {
  const id = BigInt.asUintN(64, timestamp);
  const dateBits = Number(id >> 22n);

  const unix = dateBits + discordEpoch;

  return unix.toString();
};

const getIsoTimestamp = (timestamp: any) => {
  const id = BigInt.asUintN(64, timestamp);
  const dateBits = Number(id >> 22n);

  const unix = dateBits + discordEpoch;
  const iso = new Date(unix).toISOString();

  return iso;
};
