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
          id: "command",
          type: "string",
        },
        {
          id: "argument",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  async exec(message: any, args: any) {
    let command: string = "";
    let argument: string = "";

    // Verifying command
    if (args.command) {
      // Preparing command for checks
      command = args.command.toLowerCase();
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give shopify specific command");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }

    // Verifying argument
    if (args.argument.split(" ")[1]) {
      // Checking command requirement
      if (command === "build") {
        // Removing command from content
        argument = args.argument.toLowerCase().replace("build ", "");
      } else if (command === "scrape") {
        // Removing command from content
        argument = args.argument.toLowerCase().replace("scrape ", "");
      }
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give shopify specific command");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }

    // Identifying shopify-specific command
    if (command === "build") {
      let parsedArguments: string[] = argument.split(" ");

      // Checking for two arguments
      if (parsedArguments.length === 2) {
        // Run Shopify link builder
        let hostname: string = "";
        let id: string = "";

        // Identifying and labelling arguments
        if (parsedArguments[0].startsWith("http")) {
          hostname = urlParser.parse(parsedArguments[0], true, true).hostname;
          id = parsedArguments[1];
        } else if (parsedArguments[1].startsWith("http")) {
          hostname = urlParser.parse(parsedArguments[1], true, true).hostname;
          id = parsedArguments[0];
        }

        // Create and structure embed
        const embed = await createBuildEmbed(hostname, id);

        // Sending embed to requester channel
        message.channel.send(embed);
      }
    } else if (command === "scrape") {
      // Checking for product URL
      if (argument.startsWith("http")) {
        // Run Shopify product scraper
        let data: any;

        // Fetch all data
        try {
          // Fetching product data
          data = await getData(argument);
        } catch (err) {
          console.log(err);
        }

        // Create and structure embed
        let embed = await createScrapeEmbed(data, argument);

        // Sending embed to requester channel
        message.channel.send(embed);
      }
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
