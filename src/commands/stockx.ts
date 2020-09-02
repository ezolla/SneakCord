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

      // Search product
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
    }
  }
}

module.exports = StockxCommand;
export {};

const createEmbed = (product: any) => {
  let fields = [
    { name: "Product SKU", value: product.style_id, inline: true },
    { name: "Colorway", value: product.colorway, inline: true },
    { name: "Release Date", value: product.traits[3].value, inline: true },
    { name: "Brand", value: product.brand, inline: true },
    { name: "Lowest Ask", value: product.lowest_ask, inline: true },
    { name: "Highest Bid", value: product.highest_bid, inline: true },
    { name: "Total Sold", value: product.deadstock_sold, inline: true },
    { name: "Last Sale", value: product.last_sale, inline: true },
  ];

  // Grabbing dynamic data
  product.traits.forEach((item: any) => {
    // Checking for price data
    if (item.name === "Retail Price") {
      // Putting price as first field
      fields.unshift({
        name: "Retail Price",
        value: `$${item.value}`,
        inline: true,
      });
    }
  });

  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(product.name)
    .setURL(`https://stockx.com/${product.url}`)
    .setThumbnail(product.media.imageUrl)
    .addFields(fields);

  return embed;
};
