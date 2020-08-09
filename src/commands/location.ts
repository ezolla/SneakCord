const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const nodeFetch = require("node-fetch");
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
  apiKey: "AIzaSyCUi9sWJPGRsHKyI9j2vnIFGbper7oAMkE",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

class LocationCommand extends Command {
  constructor() {
    super("location", {
      aliases: ["location"],
      args: [
        {
          id: "location",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  async exec(message: any, args: any) {
    if (args.location) {
      if (countWords(args.location) == 2) {
        const coords = args.location.split(" ");

        const result = await geocoder.reverse({
          lat: coords[0],
          lon: coords[1],
        });

        const embed = new Discord.MessageEmbed()
          .setColor("#5761C9")
          .setTitle(result[0].formattedAddress);

        return message.channel.send(embed);
      } else {
        const result = await geocoder.geocode(args.location);

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

        return message.channel.send(embed);
      }
    } else {
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give address or latitude and longitude");

      return message.channel.send(embed);
    }
  }
}

module.exports = LocationCommand;
export {};

const countWords = (str: string) => {
  return str.trim().split(/\s+/).length;
};
