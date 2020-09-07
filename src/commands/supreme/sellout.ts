// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";

class SupremeSelloutCommand extends Command {
  constructor() {
    super("supreme-sellout", {
      category: "flag",
      description: {
        content: "Scrapes Supreme sellout times",
        usage: "sellout",
        examples: ["sellout"],
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
    let link, times: any;

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

      // Fetching sellout times
      times = await getSelloutTimes(link);
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createSelloutEmbed(times, link);

    // Sending embed to requester channel
    message.channel.send(embed);
  }
}

module.exports = SupremeSelloutCommand;
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

// Fetches sellout times
const getSelloutTimes = async (link: any) => {
  let items: any = [];

  // Converting response to html
  const $ = await rp(options(link));

  // Scraping droptime banner
  let droptime = $("div.sc-moreinfos").text();

  // Scraping each sellout item record
  $(".sellout-info").each((index: any, data: any) => {
    let item: any = { id: 1 };

    // Scraping available data
    if (index) {
      item.id = index + 1;
    }
    if ($(data).find(".sellout-name").text()) {
      item.name = $(data).find(".sellout-name").text().trim();
    }
    if ($(data).find(".sellout-colorway").text()) {
      item.info = $(data).find(".sellout-colorway").text().trim();
    }
    if ($(data).find(".sellout-times").text()) {
      item.time = $(data).find(".sellout-times").text().trim();
    }

    // Pushing item into array
    items.push(item);
  });

  // Returning item data and droptime
  return {
    droptime: droptime,
    items: items,
  };
};

// Structures sellout embed
const createSelloutEmbed = async (data: any, link: any) => {
  // Adding introduction page
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Sellout Times")
    .setURL(link)
    .setDescription(
      `${data.droptime.split(" ")[0]} ${data.droptime.split(" ")[1]} ${
        data.droptime.split(" ")[2]
      }`
    );

  // Parsing items and filling table
  if (data.items) {
    let content: string = "";

    data.items.forEach((item: any) => {
      if (item.id < 15) {
        content += `${item.name.split(" ")[0]} ${
          item.name.split(" ")[1]
        }\n${item.info.replace(" - ", ", ")}\n${item.time}\n\n`;
      }
    });

    embed.addField("Sellout times", `\`\`\`${content}\`\`\``, false);
  }

  // Return structured embed
  return embed;
};
