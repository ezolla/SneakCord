const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const fetch = require("node-fetch");
const randomUseragent = require("random-useragent");

class StockxCommand extends Command {
  constructor() {
    super("stockx", {
      aliases: ["stockx", "stock-x", "sx"],
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
      let data: any;

      // Parse search term
      let searchInjection = await args.search.replace(/ /g, "%20");

      // Fetch all data
      try {
        // Fetching product data
        data = await getData(searchInjection);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(data);

      // Sending embed to requester channel
      message.channel.send(embed);
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

// Fetches product data
const getData = async (search: string) => {
  // Send POST request to product endpoint
  const response = await fetch(
    "https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.29.0&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3",
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": await randomUseragent.getRandom(),
      },
      body: `{"params":"query=${search}&hitsPerPage=20&facets=*"}`,
    }
  );

  // Checking for successful request
  if (response.status === 200) {
    // Translating response to JSON
    const data = await response.json();

    // Checking if products were returned
    if (data.hits[0]) {
      // Returning product data
      return data.hits[0];
    }
  }
};

// Structures embed
const createEmbed = (data: any) => {
  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(data.name)
    .setURL(`https://stockx.com/${data.url}`)
    .setThumbnail(data.media.imageUrl);

  // Checking and inputting dynamic data
  if (data.traits) {
    data.traits.forEach((item: any) => {
      if (item.name === "Retail Price") {
        embed.addField("Retail", `$${item.value}`, true);
      }
    });
  }
  if (data.style_id) {
    embed.addField("SKU", data.style_id, true);
  }
  if (data.colorway) {
    embed.addField("Colorway", data.colorway, true);
  }
  if (data.traits[3].value) {
    embed.addField("Release", data.traits[3].value, true);
  }
  if (data.brand) {
    embed.addField("Brand", data.brand, true);
  }
  if (data.lowest_ask) {
    embed.addField("Lowest Ask", data.lowest_ask, true);
  }
  if (data.highest_bid) {
    embed.addField("Highest Bid", data.highest_bid, true);
  }
  if (data.deadstock_sold) {
    embed.addField("Total Sold", data.deadstock_sold, true);
  }
  if (data.last_sale) {
    embed.addField("Last Sale", data.last_sale, true);
  }

  // Return structured embed
  return embed;
};
