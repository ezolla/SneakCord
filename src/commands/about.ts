// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";

class AboutCommand extends Command {
  constructor() {
    super("about", {
      aliases: ["about", "sneakcord"],
    });
  }

  // Creating embed
  aboutEmbed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("SneakCord")
    .setDescription(
      "SneakCord is a Discord bot focused on commands for the sneaker reselling community. Holding more than 20 useful commands, hosted 24/7 for free, and open-sourced for custom usage. [Invite SneakCord to you Discord community](https://discord.com/oauth2/authorize?client_id=740425221861015572&scope=bot). \n\n [Website](https://sneakcord.com) - [Github](https://github.com/ezolla/SneakCord)"
    )
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/735349347796910090/740439415326900305/sneakcord-discord.png"
    );

  exec(message: Message) {
    // Sending embed to requester channel
    return message.channel.send(this.aboutEmbed);
  }
}

module.exports = AboutCommand;
export {};
