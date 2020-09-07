// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";

class SupremeDroptimeCommand extends Command {
  constructor() {
    super("supreme-droptime", {
      category: "flag",
      description: {
        content: "Scrapes Supreme drop time",
        usage: "droptime",
        examples: ["droptime"],
      },
      args: [
        {
          id: "region",
          type: "string",
        },
      ],
    });
  }

  async exec(message: Message, args: any) {
    let link, droptime: any;

    // Fetch all data
    try {
      if (args.region === "us") {
        // Fetching us sellout link
        link = await getSelloutLink(
          "https://www.supremecommunity.com/season/fall-winter2020/times/us/"
        );
      } else if (args.region === "eu") {
        // Fetching eu sellout link
        link = await getSelloutLink(
          "https://www.supremecommunity.com/season/fall-winter2020/times/eu/"
        );
      }

      // Fetching drop time
      droptime = await getDroptime(link);
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createDroptimeEmbed(droptime, link);

    // Sending embed to requester channel
    message.channel.send(embed);
  }
}

module.exports = SupremeDroptimeCommand;
export {};

// Request options
const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches sellout link
const getSelloutLink = async (link: string) => {
  let lastestSelloutLink: string = "";

  // Converting response to html
  const $ = await rp(options(link));

  if ($("#box-latest").find("a").attr("href")) {
    lastestSelloutLink = $("#box-latest").find("a").attr("href");
  }

  // Returning latest sellout link
  return `https://www.supremecommunity.com${lastestSelloutLink}`;
};

// Fetches drop time
const getDroptime = async (link: any) => {
  // Converting response to html
  const $ = await rp(options(link));

  // Scraping droptime banner
  let droptime = $("div.sc-moreinfos").text();

  // Returning item data and droptime
  return droptime;
};

// Structures drop time embed
const createDroptimeEmbed = async (data: any, link: any) => {
  // Adding introduction page
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Droptime")
    .setURL(link)
    .setDescription(
      `${data.split(" ")[0]} ${data.split(" ")[1]} ${data.split(" ")[2]}`
    );

  // Return structured embed
  return embed;
};
