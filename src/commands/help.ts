const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const paginationEmbed = require("discord.js-pagination");

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help"],
    });
  }

  pageOne = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Help Page 1");

  pageTwo = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Help Page 2");

  pageThree = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Help Page 2");

  pages = [this.pageOne, this.pageTwo, this.pageThree];

  exec(message: any) {
    return paginationEmbed(message, this.pages);
  }
}

module.exports = HelpCommand;
export {};
