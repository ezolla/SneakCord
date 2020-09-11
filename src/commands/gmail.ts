// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";

class GmailCommand extends Command {
  constructor() {
    super("gmail", {
      aliases: ["gmail"],
      channel: "dm",
      args: [
        {
          id: "gmail",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    if (args.gmail && args.gmail.includes("@gmail.com")) {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setDescription(getGmails(args.gmail));

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Gmail help");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = GmailCommand;
export {};

// Prepares gmails for changing
const getGmails = (gmail: string) => {
  let result = "";

  for (let i = 0; i < 10; i++) {
    const gmailAddress = gmail.replace("@gmail.com", "");
    result += `${addDots(gmailAddress)}\n`;
  }

  return result;
};

// Adds dots randomly to gmails
const addDots = (gmail: any) => {
  var result = "";

  for (let i = 0; i < gmail.length; i++) {
    if (Math.round(Math.random()) == 1) {
      result += `${gmail[i]}.`;
    } else {
      result += gmail[i];
    }
  }

  if (result.charAt(result.length - 1) === ".") {
    result = result.substring(0, result.length - 1);
  }

  return `${result}@gmail.com`;
};
