// Imports
import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

class EbayCommand extends Command {
  constructor() {
    super("ebay", {
      aliases: ["ebay", "e-bay"],
      description: {
        content: "Ebay",
        usage: "ebay",
        examples: ["ebay"],
      },
    });
  }
  *args() {
    const method = yield {
      type: [["ebay-view", "view", "viewer", "views"]],
      otherwise: () => {
        return new MessageEmbed()
          .setColor("#5761C9")
          .setTitle("Ebay help embed");
      },
    };

    return Flag.continue(method);
  }
}

module.exports = EbayCommand;
export {};
