// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import got from "got";
import cheerio from "cheerio";
import Table from "easy-table";
import randomUseragent from "random-useragent";

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

  async exec(message: Message, args: any) {
    if (args.search) {
      let link, data, prices: any;

      // Parse search term
      let searchInjection = await args.search.replace(/ /g, "%20");

      // Fetch all data
      try {
        // Fetching product link
        link = await getLink(searchInjection);

        // Fetching product data
        data = await getData(searchInjection);

        // Fetching product prices
        prices = await getPrices(link);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(link, data, prices);

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

module.exports = StadiumGoodsCommand;
export {};

// Fetctes product link
const getLink = async (search: string) => {
  // Sending POST request to endpoint
  const response: any = await got.post(
    "https://graphql.stadiumgoods.com/graphql",
    {
      headers: {
        "User-Agent": randomUseragent.getRandom()!,
        "Content-Type": "application/json",
      },
      body:
        '{"operationId":"sg-front/cached-a41eba558ae6325f072164477a24d3c2","variables":{"categorySlug":"","initialSearchQuery":"' +
        search +
        '","initialSort":"RELEVANCE","includeUnavailableProducts":null,"filteringOnCategory":false,"filteringOnBrand":false,"filteringOnMensSizes":false,"filteringOnKidsSizes":false,"filteringOnWomensSizes":false,"filteringOnApparelSizes":false,"filteringOnGender":false,"filteringOnColor":false,"filteringOnPriceRange":false},"locale":"USA_USD"}',
      http2: true,
      responseType: "json",
    }
  );

  // Checking for product links
  if (response.body.data.configurableProducts.edges[0]) {
    // Returning product link
    return response.body.data.configurableProducts.edges[0].node.pdpUrl;
  }
};

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
        "User-Agent": randomUseragent.getRandom()!,
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

// Fetches price data
const getPrices = async (link: string) => {
  let priceMap: any = {};

  // Sending POST request to product endpoint
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "User-Agent": randomUseragent.getRandom()!,
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
    $(".product-sizes__input").map((i: any, product: any) => {
      if ($(product).attr("data-stock") == "true") {
        let size: any = $(product).attr("data-size");

        if (size[size.length - 1] == "W") {
          size = size.substring(0, size.length - 1);
        }
        priceMap[size] = parseInt($(product).attr("data-amount")!) / 100;
      }

      if (i == $(".product-sizes__input").length - 1) {
      }
    });
  }

  // Returning map of sizes and prices
  return priceMap;
};

// Structures embed
const createEmbed = async (link: string, data: any, prices: any) => {
  let tableData = [];

  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(data.name)
    .setURL(link)
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
  if (data.traits !== undefined && data.traits[3].value) {
    embed.addField("Release", data.traits[3].value, true);
  }
  if (data.brand) {
    embed.addField("Brand", data.brand, true);
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

  // Returning built embed
  return embed;
};
