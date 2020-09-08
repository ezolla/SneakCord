// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";
import Table from "easy-table";

class AdidasStockCommand extends Command {
  constructor() {
    super("adidas-stock", {
      category: "flag",
      description: {
        content: "Scrapes Adidas product stock",
        usage: "stock",
        examples: ["stock"],
      },
      args: [
        {
          id: "pid",
          type: "string",
        },
      ],
    });
  }
  async exec(message: Message, args: any) {
    if (args.pid.length === 6) {
      let stock, embed: any;

      try {
        // Fetching stock
        stock = await getStock(args.pid);
      } catch (error) {
        console.log(error);
      }

      // Verifying we have data
      if (stock !== undefined) {
        // Create and structure embed
        embed = await createEmbed(stock, args.pid);

        // Sending embed to requester channel
        return message.channel.send(embed);
      }
    } else {
      // Create error embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give argument");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = AdidasStockCommand;
export {};

// Fetches stock data
const getStock = async (pid: string) => {
  // Sending GET request to product endpoint
  const response = await fetch(
    `https://www.adidas.com/api/products/${pid}/availability`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": await randomUseragent.getRandom()!,
        "Content-Type": "application/json",
      },
    }
  );

  // Checking response status
  if (response.status === 200) {
    // Translating response to JSON
    const stock = await response.json();

    // Returning stock data
    return stock.variation_list;
  }
};

// Structures embed
const createEmbed = async (stock: any, pid: string) => {
  let tableData: any[] = [];

  // Create embed
  const embed = new Discord.MessageEmbed().setColor("#5761C9");

  if (stock) {
    // Parsing size and stock data into table
    stock.forEach((item: any) => {
      tableData.push({
        size: item.size,
        stock: item.availability,
      });
    });

    let t = new Table();

    tableData.forEach((pair: any) => {
      t.cell("Size", pair.size.replace(/ /g, ""));
      t.cell("Count", pair.stock);
      t.newRow();
    });

    embed.addField(`Stock - ${pid}`, `\`\`\`${t}\`\`\``, false);
  }

  // Returning structured embed
  return embed;
};
