// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";

class EbayViewCommand extends Command {
  constructor() {
    super("ebay-view", {
      category: "flag",
      description: {
        content: "Boosts Ebay product views",
        usage: "view",
        examples: ["view"],
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
    if (args.first && args.second) {
      let result: any = false;
      let link: string = "";
      let count: number = 0;
      let embed: any;

      // Identifying and labelling arguments
      if (args.first.startsWith("http")) {
        link = args.first;
        count = args.second;
      } else {
        link = args.second;
        count = args.first;
      }

      try {
        // Sending requests
        result = await sendRequests(link, count);
      } catch (error) {
        console.log(error);
      }

      // Create and structure embed
      embed = await createEmbed(result, count);

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give argument");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = EbayViewCommand;
export {};

// Sends request to Ebay product
const sendRequests = async (link: string, count: number) => {
  // Looping to send requested amount
  for (let i = 0; i < count; i++) {
    // Send GET request to product link
    const response = await fetch(link, {
      method: "GET",
      headers: {
        "User-Agent": randomUseragent.getRandom()!,
      },
    });

    // Validating request result
    if (response.status === 200) {
      continue;
    } else {
      // Returning result
      return false;
    }
  }

  // Returning result
  return true;
};

// Structures embed
const createEmbed = async (result: boolean, count: number) => {
  // Adding introduction page
  const embed = new Discord.MessageEmbed().setColor("#5761C9");

  // Adding result message
  if (result === true) {
    embed.setTitle(`Successfully viewed ${count} times`);
  } else {
    embed.setTitle(`Failed to view ${count} times`);
  }

  // Return structured embed
  return embed;
};
