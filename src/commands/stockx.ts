const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const fetch = require("node-fetch");
const got = require("got");
const randomUseragent = require("random-useragent");
const Table = require("easy-table");

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
      let data, prices: any;

      // Parse search term
      let searchInjection = await args.search.replace(/ /g, "%20");

      // Fetch all data
      try {
        // Fetching product data
        data = await getData(searchInjection);

        // Fetching pricing data
        prices = await getPrices(data.url);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(data, prices);

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
      method: "POST",
      headers: {
        "User-Agent": await randomUseragent.getRandom(),
        "Content-Type": "application/json",
        Accept: "application/json",
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

// Fetches product prices
const getPrices = async (slug: string) => {
  let priceMap: any = {};

  // Sending GET request to product market endpoint
  const response = await got(
    `https://stockx.com/api/products/${slug}?includes=market`,
    {
      headers: {
        "User-Agent": await randomUseragent.getRandom(),
        "Content-Type": "application/json",
      },
      http2: true,
    }
  );

  // Translating response to JSON
  const data = await JSON.parse(response.body);

  // Load price map with size:price pairs
  Object.keys(data.Product.children).forEach(function (key) {
    if (data.Product.children[key].market.lowestAsk == 0) return;

    // Removing "W" if sizing is in womens
    let size = data.Product.children[key].shoeSize;
    if (size[size.length - 1] == "W") {
      size = size.substring(0, size.length - 1);
    }

    priceMap[size] = data.Product.children[key].market.lowestAsk;
  });

  // Returning map of sizes and prices
  return priceMap;
};

// Structures embed
const createEmbed = (data: any, prices: any) => {
  let tableData = [];

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
    embed.addField("Lowest Ask", `$${data.lowest_ask}`, true);
  }
  if (data.highest_bid) {
    embed.addField("Highest Bid", `$${data.highest_bid}`, true);
  }
  if (data.deadstock_sold) {
    embed.addField("Total Sold", data.deadstock_sold, true);
  }
  if (data.last_sale) {
    embed.addField("Last Sale", `$${data.last_sale}`, true);
  }

  // Parsing size and price data into table
  if (prices) {
    for (let size in prices) {
      if (prices.hasOwnProperty(size)) {
        tableData.push({ size: size, price: `$${prices[size]}` });
      }
    }

    let t = new Table();

    tableData.forEach((pair: any) => {
      t.cell("Size", pair.size);
      t.cell("Price", pair.price);
      t.newRow();
    });

    embed.addField("Live Market", `\`\`\`${t}\`\`\``, false);
  }

  // Return structured embed
  return embed;
};
