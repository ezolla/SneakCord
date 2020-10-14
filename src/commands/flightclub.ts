// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import got from "got";
import Table from "easy-table";
import randomUseragent from "random-useragent";

class FlightclubCommand extends Command {
  constructor() {
    super("flightclub", {
      aliases: ["flightclub", "flight-club", "flight", "fc"],
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
        prices = await getPrices(link!);
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

module.exports = FlightclubCommand;
export {};

// Fetches product link
const getLink = async (search: string) => {
  // Sending POST request to endpoint
  const response = await fetch(
    "https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.4.0%3BJS%20Helper%202.26.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a",
    {
      method: "POST",
      headers: {
        "User-Agent": randomUseragent.getRandom()!,
        "Content-Type": "application/json",
      },
      body: `{\"requests\":[{\"indexName\":\"product_variants_v2_flight_club\",\"params\":\"query=${search}&hitsPerPage=1&maxValuesPerFacet=1&filters=&facets=%5B%22lowest_price_cents_usd%22%5D&tagFilters=\"}]}`,
    }
  );

  // Translating response to JSON
  const data = await response.json();

  // Checking for valuable information
  if (data.results[0].hits[0]) {
    if (data.results[0].hits[0].lowest_price_cents_usd / 100 != 0) {
      // Returning link
      return `https://www.flightclub.com/${data.results[0].hits[0].slug}`;
    }
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

// Fetches product prices
const getPrices = async (link: string) => {
  let priceMap: any = {};

  // Forming slug
  const slug = link.split(".com/")[1];

  // Sending GET request to token endpoint
  const response = await got("https://www.flightclub.com/token", {
    headers: {
      "User-Agent": randomUseragent.getRandom()!,
      Cookie:
        "_px=ix0zdTaW9LX5FkTRCk2o6P1xVuZLp2EmWliBXmFwV6MJUrXOH8Uan2ASNbqI31XE9tOJHtqzyxeAFIYhutRsJQ==:1000:8abN7vQRMjLHrmzD21CE2tkEsRZjiS4NwNMyT0RG82aN7Uef8nee8VtmqVLrTu6ODxe6Wg1uhy4VO1cTuqDDb/T6ZNAyU//eQ+mA2/+U2rtDrFHLV6VFggcIb8dXrZ+7ZJIrzLccdPnHRXgGs2e4DkuboG/QNdL89BgvMKX9w4+iePORFevy19dikWMd4dvOy7iQe6ew8+fgLUISDwd/HgEhx7gz2Ca8O8kVYYVTItfqLBHuT0oX24rMr+jXw+rOU1964meDRPupESN+NQ+8OA==; _px3=88e35dfdd999742e499b4b1726c5fa15fed855e02ea8b87b642d5df10069f95e:ix0zdTaW9LX5FkTRCk2o6P1xVuZLp2EmWliBXmFwV6MJUrXOH8Uan2ASNbqI31XE9tOJHtqzyxeAFIYhutRsJQ==:1000:PhZWSzqW+Dq8GjvM9FyliwP+y9nZWEbJ0Pj+TqqvqHnYXnm+aq35sN1ryrNqdBSuuKH1Sz0P0/ds/F4XITQOSnlxT6SlG8O6ct6KN368mlooQ73QTRDNgMlar4vrXjEP7+bBbkXQ1n9Z3OoYHn0eoD2gCYFEBVwLOF+U8Wt4Upw=; _pxde=27e2b8e7cb6ee7e8cc1906d0923d7d1a0c7c034e474af9c81c6801cd3945fbfb:eyJ0aW1lc3RhbXAiOjE1OTc0NTc2ODc1ODMsImZfa2IiOjAsImlwY19pZCI6W119; _xsrf=7qdouxAB-BIwWfHbIYYqMH2izXk4KVo8cchQ; _ga=GA1.2.1126372851.1597453797; _gid=GA1.2.916763049.1597453797; __stripe_mid=9d7e3b31-b734-46c1-b1e2-06fb5b7d145a96bef2; _fbp=fb.1.1597453797280.687696110; __cfduid=d1ad10bcf33084d748458a2c5628d07951595609624; _csrf=a0IHQoXaUlfH3H3X4UgrYB4e; _pxvid=b164dfb6-979b-11ea-869f-0242ac12000b; GSIDPE8xI3mBKqVw=d157f2f9-4c3c-4fcc-beee-6e5ff281eae2; optimizelyBuckets=%7B%7D; optimizelySegments=%7B%22985729904%22%3A%22safari%22%2C%22986786736%22%3A%22search%22%2C%22995297024%22%3A%22false%22%7D; 3060738.3440491=7452ec8e-d2bb-4b7f-bcbf-474676736c2a; tracker_device=bfe4ad7b-07db-401e-8b4a-a7739ff53d2d; optimizelyEndUserId=oeu1511627844219r0.6301887025421603",
    },
    http2: true,
  });

  // Translating response to token
  const token = response.body;

  const response2 = await got.post("https://www.flightclub.com/graphql", {
    headers: {
      "User-Agent": await randomUseragent.getRandom()!,
      "Content-Type": "application/json",
      "x-csrf-token": token,
      cookie:
        "_xsrf=FREXfIF7-BGe3OCo4hf8dHfRYjjXcwdM93As; __stripe_mid=9d7e3b31-b734-46c1-b1e2-06fb5b7d145a96bef2; __stripe_sid=a29c148b-d115-422a-b59f-12fcdc81a11415823f; _pxde=c8380fc70f4a5a9949cf5d58344c5439ef4fd8247a1e34340ab618ff26568db4:eyJ0aW1lc3RhbXAiOjE1OTc0NTQwMTc2NjQsImZfa2IiOjAsImlwY19pZCI6W119; _pxff_rf=1; _fbp=fb.1.1597453797280.687696110; _ga=GA1.2.1126372851.1597453797; _gat_mpgaTracker1=1; _gid=GA1.2.916763049.1597453797; _px=ZOoCF6+JSOlnWd8pKYpDCd8n1WPTwT9y5XAKjYeblsvmSRZaRhHlC6qMHSisweoMQWJModVYjTVoz8EGpYopfg==:1000:EAUHGsrfbiX/7VUZdSUpQQd36EdGoe2f4gByUrTejKWzwhXh0tXVYhChyVG7utQi/R3dnbhuO+jZcw6N4pbcVDBPhkiIei3ct29jjqelkobZE2muCk/XSCS/udkcReFGlY9bFX499ink+XQ/3PphvjXVa9J8WC2e/Hv0OGPojI7jIRQ/MOi8+vQiYkX/9HWjbpVqQ/eXqrRw6hshLvJRYDad8LqSnMnA8fNt7dVvH+Y6SOaoxl3uBFbY23uRe6fTzXaJx77j19xn1JqcYbOgOw==; _px3=d9aac359bd0aaaea0a096f9446e0c0fa30021c9b6ff085acf605a67678716f53:ZOoCF6+JSOlnWd8pKYpDCd8n1WPTwT9y5XAKjYeblsvmSRZaRhHlC6qMHSisweoMQWJModVYjTVoz8EGpYopfg==:1000:ngReUmftMTihtszoIPpzYZYH90XfN6DHkJg2aeKDIeet1xyiMA9ZpUAR6BwF7wTOYy8EdvGTojvjMWUAmfFn4Qq8F267o/o42mX+VlpLoQ01A97KgH+pYx4V86ZGHtHY1a7Pxk7/x0aiGNmcRG5ONqHOvaA6fEpWMRYtuoXmLu4=; __cfduid=d1ad10bcf33084d748458a2c5628d07951595609624; _csrf=a0IHQoXaUlfH3H3X4UgrYB4e; _pxvid=b164dfb6-979b-11ea-869f-0242ac12000b; GSIDPE8xI3mBKqVw=d157f2f9-4c3c-4fcc-beee-6e5ff281eae2; optimizelyBuckets=%7B%7D; optimizelySegments=%7B%22985729904%22%3A%22safari%22%2C%22986786736%22%3A%22search%22%2C%22995297024%22%3A%22false%22%7D; 3060738.3440491=7452ec8e-d2bb-4b7f-bcbf-474676736c2a; tracker_device=bfe4ad7b-07db-401e-8b4a-a7739ff53d2d; optimizelyEndUserId=oeu1511627844219r0.6301887025421603",
    },
    body:
      '{"operationName":"getProductTemplate","variables":{"slug":"' +
      slug +
      '"},"query":"query getProductTemplate($slug: String!) {\\n  getProductTemplate(slug: $slug) {\\n    id\\n    storyHtml\\n    sku\\n    description\\n    releaseDate {\\n      shortDisplay\\n      __typename\\n    }\\n    newSizes {\\n      productTemplateId\\n      size {\\n        value\\n        display\\n        __typename\\n      }\\n      shoeCondition\\n      boxCondition\\n      lowestPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      instantShipPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      isInstantShip\\n      __typename\\n    }\\n    newLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    usedLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    sizePickerDefault {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    sizePickerOptions {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    sizeCategory\\n    productCategory\\n    __typename\\n  }\\n}\\n\\nfragment ProductTemplatePriceDisplayParts on Price {\\n  display(useGrouping: false, hideEmptyCents: true)\\n  localizedValue\\n  value\\n  __typename\\n}\\n\\nfragment SizePickerOptionParts on SizePickerOption {\\n  size {\\n    display\\n    value\\n    __typename\\n  }\\n  new {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  used {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n"}',
    http2: true,
  });

  // Translating response to token
  const json = JSON.parse(response2.body);

  for (let i = 0; i < json.data.getProductTemplate.newSizes.length; i++) {
    priceMap[json.data.getProductTemplate.newSizes[i].size.display] =
      json.data.getProductTemplate.newSizes[i].lowestPriceOption.price.value /
      100;
  }

  // Returning map of sizes and prices
  return priceMap;
};

// Structures embed
const createEmbed = async (link: any, data: any, prices: any) => {
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
