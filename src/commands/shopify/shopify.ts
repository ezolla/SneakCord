// Imports
import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

class ShopifyCommand extends Command {
  constructor() {
    super("shopify", {
      aliases: ["shopify", "shop", "shopify-variants", "variants"],
      description: {
        content: "Shopify",
        usage: "shopify",
        examples: ["shopify"],
      },
    });
  }
  *args() {
    const method = yield {
      type: [
        ["shopify-scrape", "scrape", "fetch", "get"],
        ["shopify-build", "build", "join", "create"],
      ],
      otherwise: () => {
        return new MessageEmbed()
          .setColor("#5761C9")
          .setTitle("Shopify help embed");
      },
    };

    return Flag.continue(method);
  }
}

module.exports = ShopifyCommand;
export {};
