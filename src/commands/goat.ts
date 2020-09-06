// Imports
import Discord from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";
import Table from "easy-table";
import randomUseragent from "random-useragent";

class GoatCommand extends Command {
  constructor() {
    super("goat", {
      aliases: ["goat", "goatapp", "goat-app"],
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
      let link: any, prices, data;

      // Parse search term
      let searchInjection = await args.search.replace(/ /g, "%20");

      // Fetch all data
      try {
        // Fetch product link
        link = await getLink(searchInjection);

        // Fetch product prices
        prices = await getPrices(link!);

        // Fetch product data
        data = await getData(link!);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createEmbed(link!, prices, data);

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

module.exports = GoatCommand;
export {};

// Fetches product link
const getLink = async (search: string) => {
  // Sending POST request to search endpoint
  const response = await fetch(
    "https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.2.0)%3BJS%20Helper%20(3.1.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a",
    {
      method: "POST",
      headers: {
        "User-Agent": await randomUseragent.getRandom()!,
        "Content-Type": "application/json",
      },
      body: `{"requests":[{"indexName":"product_variants_v2","params":"distinct=true&maxValuesPerFacet=1&page=0&query=${search}&facets=%5B%22instant_ship_lowest_price_cents"}]}`,
    }
  );

  // Translating response to JSON
  const data = await response.json();

  // Checking for valuable information
  if (data.results[0].hits[0]) {
    if (data.results[0].hits[0].lowest_price_cents_usd / 100 != 0) {
      // Returning link
      return `https://www.goat.com/sneakers/${data.results[0].hits[0].slug}`;
    }
  }
};

// Fetches product data
const getData = async (link: string) => {
  // Forming endpoint
  let apiEndpoint = link.replace("sneakers", "web-api/v1/product_templates");

  // Sending GET request to endpoint
  const response = await fetch(apiEndpoint, {
    method: "GET",
    headers: {
      "User-Agent": await randomUseragent.getRandom()!,
      "Content-Type": "application/json",
    },
  });

  // Translating response to JSON
  const data = await response.json();

  // Returning useful data
  return {
    brand: data.brandName,
    designer: data.designer,
    colorway: data.details,
    image: data.mainPictureUrl,
    name: data.name,
    release: data.releaseDate,
    silhouette: data.silhouette,
    sku: data.sku,
  };
};

// Fetches product prices
const getPrices = async (link: string) => {
  let priceMap: any = {};

  // Forming endpoint
  let apiEndpoint = link.replace(
    "sneakers/",
    "web-api/v1/product_variants?productTemplateId="
  );

  // Sending GET request to endpoint
  const response = await fetch(apiEndpoint, {
    method: "GET",
    headers: {
      "User-Agent": await randomUseragent.getRandom()!,
      "Content-Type": "application/json",
    },
  });

  // Translating response to JSON
  const data = await response.json();

  // Looping through price data to grab size and price pairs
  for (var i = 0; i < data.length; i++) {
    if (data[i].shoeCondition == "used") continue;

    if (priceMap[data[i].size]) {
      priceMap[data[i].size] =
        data[i].lowestPriceCents.amount / 100 < priceMap[data[i].size]
          ? data[i].lowestPriceCents.amount / 100
          : priceMap[data[i].size];
    } else {
      priceMap[data[i].size] = data[i].lowestPriceCents.amount / 100;
    }
  }

  // Returning price map
  return priceMap;
};

// Structures embed
const createEmbed = async (link: string, prices: any, data: any) => {
  let tableData = [];

  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(`${data.name}`)
    .setURL(link)
    .setThumbnail(data.image);

  // Checking and inputting dynamic data
  if (data.brand) {
    embed.addField("Brand", data.brand, true);
  }
  if (data.designer) {
    embed.addField("Designer", data.designer, true);
  }
  if (data.colorway) {
    embed.addField("Colorway", data.colorway, true);
  }
  if (data.release) {
    const date = data.release.split("T");
    embed.addField("Release", date[0], true);
  }
  if (data.silhouette) {
    embed.addField("Silhouette", data.silhouette, true);
  }
  if (data.sku) {
    embed.addField("SKU", data.sku, true);
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
