// Imports
import Discord from "discord.js";
import { Command } from "discord-akairo";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";

class FunkoCommand extends Command {
  constructor() {
    super("funko", {
      aliases: ["funko", "pop"],
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
      let searchInjection = await args.search.replace(/ /g, "+");

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

module.exports = FunkoCommand;
export {};

// Fetches product data
const getData = async (search: string) => {
  // Send GET request to product search endpoint
  const response = await fetch(
    `https://www.hobbydb.com/api/catalog_items?include_cit=true&include_main_images=true&market_id=hobbydb&order=%7B%22name%22:%22created_at%22,%22sort%22:%22desc%22%7D&page=1&q=funko+pop+${search}&serializer=CatalogItemPudbSerializer&subvariants=true`,
    {
      method: "GET",
      headers: {
        "User-Agent": await randomUseragent.getRandom()!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // Checking for successful status
  if (response.status === 200) {
    // Translating response to JSON
    const data = await response.json();

    // Checking if product data is availabe
    if (data.data[0].attributes) {
      // Returning product search data
      return data;
    }
  }
};

// Structures embed
const createEmbed = (data: any) => {
  // Create embed
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle(data.data[0].attributes.name)
    .setURL(
      `https://www.hobbydb.com/marketplaces/hobbydb/catalog_items/${data.data[0].attributes.slug}`
    )
    .setThumbnail(data.data[0].attributes.images.main_photo_url);

  // Checking and inputting dynamic product data
  if (data.data[0].attributes.estimated_value) {
    embed.addField(
      "Resell",
      `$${data.data[0].attributes.estimated_value}`,
      true
    );
  }

  // Checking and inputting dynamic field data
  data.data[0].attributes.fields.forEach((field: any) => {
    if (field.name === "Brand") {
      embed.addField("Brand", field.data[0].value, true);
    }
    if (field.name === "Series") {
      let seriesList: string = "";

      // Concatenating all available series
      if (field.data[0].value) {
        field.data.forEach((item: any) => {
          seriesList += `${item.value}, `;
        });
      }

      // Concatenating series neatly with commas
      if (seriesList.endsWith(", ")) {
        seriesList = seriesList.substring(0, seriesList.length - 2);
      }
      embed.setDescription(seriesList);
    }
    if (field.name === "Reference #") {
      embed.addField("Reference", `#${field.data[0].value}`, true);
    }
    if (field.name === "Produced") {
      let release = field.data[0].value;

      // Removing "From: " prefix
      if (field.data[0].value) {
        release = release.substring(6, release.length);
      }

      embed.addField("Released", release, true);
    }
    if (field.name === "Scale") {
      embed.addField("Scale", `${field.data[0].value}`, true);
    }
    if (field.name === "Depicts") {
      embed.addField("Depicts", field.data[0].value, true);
    }
  });

  // Return structured embed
  return embed;
};
