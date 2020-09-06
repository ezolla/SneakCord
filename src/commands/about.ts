// Imports
import Discord from "discord.js";
import { Command } from "discord-akairo";

class AboutCommand extends Command {
  constructor() {
    super("about", {
      aliases: ["about"],
    });
  }

  aboutEmbed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("SneakCord")
    .setDescription(
      "The Discord toolkit you’ll enjoy managing. Providing sneaker focused Discord tooling to your group. \n\n [Website](https://sneakcord.com) - [Twitter](https://twitter.com/SneakCord)"
    )
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/735349347796910090/740439415326900305/sneakcord-discord.png"
    );

  exec(message: any) {
    return message.channel.send(this.aboutEmbed);
  }
}

module.exports = AboutCommand;
export {};
