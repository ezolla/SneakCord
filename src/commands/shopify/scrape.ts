// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";
import Table from "easy-table";

class ShopifyScrapeCommand extends Command {
  constructor() {
    super("shopify-scrape", {
      category: "flag",
      description: {
        content: "Scrape Shopify products",
        usage: "scrape",
        examples: ["scrape"],
      },
      args: [
        {
          id: "link",
          type: "string",
        },
      ],
    });
  }
  async exec(message: Message, args: any) {
    // Checking for product URL
    if (args.link.startsWith("http")) {
      // Run Shopify product scraper
      let data: any;

      // Fetch all data
      try {
        // Fetching product data
        data = await getData(args.link);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = createScrapeEmbed(data, args.link);

      // Sending embed to requester channel
      message.channel.send(embed);
    }
  }
}

module.exports = ShopifyScrapeCommand;
export {};

// Fetches product data
const getData = async (url: string) => {
  // Send POST request to product endpoint
  const response = await fetch(`${url}.json`, {
    method: "GET",
    headers: {
      "User-Agent": randomUseragent.getRandom()!,
      "Content-Type": "application/json",
    },
  });

  // Checking for successful request
  if (response.status === 200) {
    // Translating response to JSON
    const data = await response.json();

    // Returning product data
    return data;
  }
};

// Structures scrape embed
const createScrapeEmbed = (data: any, url: string) => {
  let tableData: any = [];

  // Create embed
  const embed = new Discord.MessageEmbed().setColor("#5761C9");

  // Checking and inputting dynamic data
  if (data.product.title) {
    embed.setTitle(data.product.title);
  }
  if (data.product.image) {
    embed.setThumbnail(data.product.image.src);
  }
  if (url) {
    embed.setURL(url);
  }
  if (data.product.variants[0].price) {
    embed.addField("Price", `$${data.product.variants[0].price}`, true);
  }
  if (data.product.vendor) {
    embed.addField("Vendor", data.product.vendor, true);
  }
  if (data.product.product_type) {
    embed.addField("Category", data.product.product_type, true);
  }
  if (data.product.created_at) {
    embed.addField(
      "Created",
      `${data.product.created_at.split("T")[0]}\n${
        data.product.created_at.split("T")[1].split("-")[0]
      }`,
      true
    );
  }
  if (data.product.updated_at) {
    embed.addField(
      "Updated",
      `${data.product.updated_at.split("T")[0]}\n${
        data.product.updated_at.split("T")[1].split("-")[0]
      }`,
      true
    );
  }
  if (data.product.published_at) {
    embed.addField(
      "Published",
      `${data.product.published_at.split("T")[0]}\n${
        data.product.published_at.split("T")[1].split("-")[0]
      }`,
      true
    );
  }
  if (data.product.tags) {
    let parsedTags = data.product.tags.split(",");
    let index = parsedTags.length - 1;

    // Cleaning out low-tier keywords
    while (index >= 0) {
      if (parsedTags[index].includes("size")) {
        parsedTags.splice(index, 1);
      }

      index -= 1;
    }

    embed.addField("Keywords", `\`\`\`${parsedTags}\`\`\``, false);
  }
  if (data.product.variants) {
    // Looping product variants
    data.product.variants.forEach((variant: any) => {
      // Fulfilling data into display table
      tableData.push({
        size: variant.title.replace(/^(.{1}[^\s]*).*/, "$1"),
        cart: variant.id,
      });
    });

    // Creating display table
    let t = new Table();

    // Structuring display table
    tableData.forEach((variant: any) => {
      t.cell("Size", variant.size);
      t.cell("Cart ID", variant.cart);
      t.newRow();
    });

    embed.addField("Variants", `\`\`\`${t}\`\`\``, false);
  }

  // Return structured embed
  return embed;
};
