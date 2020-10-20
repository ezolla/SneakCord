// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import nodeFetch from "node-fetch";
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",

  // Optional depending on the providers
  fetch: function fetch(url: any, options: any) {
    return nodeFetch(url, {
      ...options,
      headers: {
        "user-agent": "SneakCord <ezoller11@gmail.com>",
        "X-Specific-Header": "Specific value",
      },
    });
  },
  apiKey: process.env.GEOCODING_API_KEY as string,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

class LocationCommand extends Command {
  constructor() {
    super("location", {
      aliases: ["location", "coords"],
      args: [
        {
          id: "location",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    if (args.location) {
      // Identifying argument
      if (countWords(args.location) == 2) {
        // Splitting argument
        const coords = args.location.split(" ");

        // Finding results
        const result = await geocoder.reverse({
          lat: coords[0],
          lon: coords[1],
        });

        // Creating embed
        const embed = new Discord.MessageEmbed()
          .setColor("#5761C9")
          .setTitle(result[0].formattedAddress);

        // Sending embed to requester channel
        return message.channel.send(embed);
      } else {
        // Finding results
        const result = await geocoder.geocode(args.location);

        // Creating embed
        const embed = new Discord.MessageEmbed().setColor("#5761C9").addFields(
          {
            name: "Latitude",
            value: result[0].latitude,
            inline: true,
          },
          {
            name: "Longitude",
            value: result[0].longitude,
            inline: true,
          }
        );

        // Sending embed to requester channel
        return message.channel.send(embed);
      }
    } else {
      // Creating embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give address or latitude and longitude");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = LocationCommand;
export {};

// Counts number of words
const countWords = (str: string) => {
  return str.trim().split(/\s+/).length;
};
