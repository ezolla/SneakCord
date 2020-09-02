const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const fetch = require("node-fetch");
const randomUseragent = require("random-useragent");

class StockxCommand extends Command {
  constructor() {
    super("stockx", {
      aliases: ["stockx", "stock-x", "stock", "sx"],
      args: [
        {
          id: "search",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  async exec(message: any, args: any) {
    if (args.search) {
      // Parse search term
      let searchInjection = await args.search.replace(" ", "%20");

      // Send POST request to search endpoint
      await fetch(
        "https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.29.0&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": await randomUseragent.getRandom(),
          },
          body: `{"params":"query=${searchInjection}&hitsPerPage=20&facets=*"}`,
        }
      )
        .then((res: any) => res.json())
        .then((json: any) => message.channel.send(createEmbed(json.hits[0])));
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give product search");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = StockxCommand;
export {};

const createEmbed = (product: any) => {
  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(product.name)
    .setURL(`https://stockx.com/${product.url}`)
    .setThumbnail(product.media.imageUrl);

  // Checking and inputting dynamic data
  product.traits.forEach((item: any) => {
    // Checking for price data
    if (item.name === "Retail Price") {
      // Putting price as first field
      embed.addField("Retail Price", item.value, true);
    }
  });
  if (product.style_id) {
    embed.addField("SKU", product.style_id, true);
  }
  if (product.colorway) {
    embed.addField("Colorway", product.colorway, true);
  }
  if (product.traits[3].value) {
    embed.addField("Release", product.traits[3].value, true);
  }
  if (product.brand) {
    embed.addField("Brand", product.brand, true);
  }
  if (product.lowest_ask) {
    embed.addField("Lowest Ask", product.lowest_ask, true);
  }
  if (product.highest_bid) {
    embed.addField("Highest Bid", product.highest_bid, true);
  }
  if (product.deadstock_sold) {
    embed.addField("Total Sold", product.deadstock_sold, true);
  }
  if (product.last_sale) {
    embed.addField("Last Sale", product.last_sale, true);
  }

  // Return structured embed
  return embed;
};
