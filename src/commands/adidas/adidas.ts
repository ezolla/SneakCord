// Imports
import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

class AdidasCommand extends Command {
  constructor() {
    super("adidas", {
      aliases: ["adidas"],
      description: {
        content: "Adidas",
        usage: "adidas",
        examples: ["adidas"],
      },
    });
  }
  *args() {
    const method = yield {
      type: [
        ["adidas-scrape", "scrape", "price", "get", "search"],
        ["adidas-stock", "stock"],
        ["adidas-room", "room", "waiting", "waitingroom", "waiting-room"],
      ],
      otherwise: () => {
        return new MessageEmbed()
          .setColor("#5761C9")
          .setTitle("Adidas help embed");
      },
    };

    return Flag.continue(method);
  }
}

module.exports = AdidasCommand;
export {};
