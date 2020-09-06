// Imports
import Discord from "discord.js";
import { Command } from "discord-akairo";

class AddressCommand extends Command {
  constructor() {
    super("address", {
      aliases: ["address"],
      channel: "dm",
      args: [
        {
          id: "address",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  exec(message: any, args: any) {
    if (args.address) {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setDescription(getAddresses(args.address));

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give address");

      return message.channel.send(embed);
    }
  }
}

module.exports = AddressCommand;
export {};

const getAddresses = (address: string) => {
  console.log(`Address: ${address}`);

  let result = "";

  for (let i = 0; i < 10; i++) {
    result += `${genPrefix()} ${address}\n`;
  }

  return result;
};

const genPrefix = () => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
