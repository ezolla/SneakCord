const Discord = require("discord.js");
const { Command } = require("discord-akairo");

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

  exec(message: any, args: any) {
    if (args.gmail && args.gmail.includes("@gmail.com")) {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setDescription(getGmails(args.gmail));

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give gmail");

      return message.channel.send(embed);
    }
  }
}

module.exports = GmailCommand;
export {};

const getGmails = (gmail: string) => {
  let result = "";

  for (let i = 0; i < 10; i++) {
    const gmailAddress = gmail.replace("@gmail.com", "");
    result += `${addDots(gmailAddress)}\n`;
  }

  return result;
};

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
