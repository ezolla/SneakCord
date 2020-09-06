// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import urlParser from "url";

class ShopifyBuildCommand extends Command {
  constructor() {
    super("shopify-build", {
      category: "flag",
      description: {
        content: "Build Shopify cart links",
        usage: "build",
        examples: ["build"],
      },
      args: [
        {
          id: "first",
          type: "string",
        },
        {
          id: "second",
          type: "string",
        },
      ],
    });
  }
  async exec(message: Message, args: any) {
    let hostname: any = "";
    let id: any = "";

    // Identifying and labelling arguments
    if (args.first.startsWith("http")) {
      hostname = urlParser.parse(args.first, true, true).hostname;
      id = args.second;
    } else {
      hostname = urlParser.parse(args.second, true, true).hostname;
      id = args.first;
    }

    // Create and structure embed
    const embed = createBuildEmbed(hostname, id);

    // Sending embed to requester channel
    message.channel.send(embed);
  }
}

module.exports = ShopifyBuildCommand;
export {};

// Structures build embed
const createBuildEmbed = (hostname: string, id: string) => {
  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(`https://${hostname}/cart/${id}:1`)
    .setURL(`https://${hostname}/cart/${id}:1`);

  // Return structured embed
  return embed;
};
