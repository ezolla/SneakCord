const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const fetch = require("node-fetch");
const got = require("got");
const cheerio = require("cheerio");
const Table = require("easy-table");
const randomUseragent = require("random-useragent");

class StadiumGoodsCommand extends Command {
  constructor() {
    super("stadiumgoods", {
      aliases: ["stadiumgoods", "stadium-goods", "stadium", "sg"],
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
      let link, prices: any;

      // Parse search term
      let searchInjection = await args.search.replace(/ /g, "%20");

      // Fetch all data
      try {
        // Fetching product link
        link = await getLink(searchInjection);

        // Fetching product prices
        prices = await getPrices(link);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(link, prices);

      // Sending embed to requester channel
      message.channel.send(embed);
    }
  }
}

module.exports = StadiumGoodsCommand;
export {};

// Fetctes product link
const getLink = async (search: string) => {
  // Sending POST request to endpoint
  const response = await got.post("https://graphql.stadiumgoods.com/graphql", {
    headers: {
      "User-Agent": await randomUseragent.getRandom(),
      "Content-Type": "application/json",
    },
    body:
      '{"operationId":"sg-front/cached-a41eba558ae6325f072164477a24d3c2","variables":{"categorySlug":"","initialSearchQuery":"' +
      search +
      '","initialSort":"RELEVANCE","includeUnavailableProducts":null,"filteringOnCategory":false,"filteringOnBrand":false,"filteringOnMensSizes":false,"filteringOnKidsSizes":false,"filteringOnWomensSizes":false,"filteringOnApparelSizes":false,"filteringOnGender":false,"filteringOnColor":false,"filteringOnPriceRange":false},"locale":"USA_USD"}',
    http2: true,
    responseType: "json",
  });

  // Checking for product links
  if (response.body.data.configurableProducts.edges[0]) {
    // Returning product link
    return response.body.data.configurableProducts.edges[0].node.pdpUrl;
  }
};

// Fetches price data
const getPrices = async (link: string) => {
  let priceMap: any = {};

  // Sending POST request to product endpoint
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "User-Agent": await randomUseragent.getRandom(),
      "Content-Type": "application/json",
    },
    body: "",
  });

  // Checking for successful status
  if (response.status === 200) {
    // Translating response to text
    const data = await response.text();

    // Loading HTML into cheerio
    const $ = await cheerio.load(data);

    // Scraping frontend sizes and prices
    await $(".product-sizes__input").map((i: any, product: any) => {
      if ($(product).attr("data-stock") == "true") {
        let size = $(product).attr("data-size");

        if (size[size.length - 1] == "W") {
          size = size.substring(0, size.length - 1);
        }
        priceMap[size] = parseInt($(product).attr("data-amount")) / 100;
      }

      if (i == $(".product-sizes__input").length - 1) {
      }
    });
  }

  // Returning map of sizes and prices
  return priceMap;
};

// Structures embed
const createEmbed = async (link: string, prices: any) => {
  let tableData = [];

  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Stadium Goods Search Results")
    .setURL(link);

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

  // Returning built embed
  return embed;
};
