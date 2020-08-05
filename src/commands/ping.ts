const Discord = require("discord.js");
const { Command } = require("discord-akairo");

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
    });
  }

  pingEmbed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(":ping_pong: Pong!");

  exec(message: any) {
    return message.channel.send(this.pingEmbed);
  }
}

module.exports = PingCommand;
export {};
