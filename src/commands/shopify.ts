const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const fetch = require("node-fetch");
const randomUseragent = require("random-useragent");
const Table = require("easy-table");
const urlParser = require("url");

class ShopifyCommand extends Command {
  constructor() {
    super("shopify", {
      aliases: ["shopify", "shop", "shopify-variants", "variants"],
      args: [
        {
          id: "url",
          type: "string",
        },
      ],
    });
  }

  async exec(message: any, args: any) {
    if (args.url) {
      let data: any;

      // Fetch all data
      try {
        // Fetching product data
        data = await getData(args.url);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(data, args.url);

      // Sending embed to requester channel
      message.channel.send(embed);
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give shopify product URL");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = ShopifyCommand;
export {};

// Fetches product data
const getData = async (url: string) => {
  // Send POST request to product endpoint
  const response = await fetch(`${url}.json`, {
    method: "GET",
    headers: {
      "User-Agent": await randomUseragent.getRandom(),
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

// Structures embed
const createEmbed = (data: any, url: string) => {
  let tableData: any = [];
  let host: string = "";

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
    embed.addField("Keywords", `\`\`\`${data.product.tags}\`\`\``, false);
  }
  if (data.product.variants) {
    // Parsing site hostname for cart links
    if (url) {
      host = urlParser.parse(url, true, true).hostname;
    }

    // Looping product variants
    data.product.variants.forEach((variant: any) => {
      // Fulfilling data into display table
      tableData.push({
        size: variant.title.replace(/^(.{1}[^\s]*).*/, "$1"),
        cart: `https://${host}/cart/${variant.id}:1`,
      });
    });

    // Creating display table
    let t = new Table();

    // Structuring display table
    tableData.forEach((variant: any) => {
      t.cell("Size", variant.size);
      t.cell("Cart", variant.cart);
      t.newRow();
    });

    embed.addField("Variants", `\`\`\`${t}\`\`\``, false);
  }

  // Return structured embed
  return embed;
};
