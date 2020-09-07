// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";
const paginationEmbed = require("discord.js-pagination");

class SupremeLookbookCommand extends Command {
  constructor() {
    super("supreme-lookbook", {
      category: "flag",
      description: {
        content: "Scrapes Supreme lookbook",
        usage: "lookbook",
        examples: ["lookbook"],
      },
    });
  }
  async exec(message: Message) {
    let items: any;

    // Fetch all data
    try {
      // Fetching recent droplist
      items = await getLookbook();
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createLookbookEmbed(items);

    // Sending embed to requester channel
    return paginationEmbed(message, embed);
  }
}

module.exports = SupremeLookbookCommand;
export {};

// Request options
const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches lookbook data
const getLookbook = async () => {
  let lookbookItems: any = [];

  // Converting response to html
  const $ = await rp(options("https://www.supremenewyork.com/lookbooks"));

  // Loop through loobook items
  $("#lookbook-items").each((_index: any, ul: any) => {
    const children = $(ul).children();
    children.each((_index: any, li: any) => {
      const children = $(li).children();
      children.each((_index: any, data: any) => {
        let item: any = {};

        // Scrape available data
        if ($(data).find("button").attr("data-idx")) {
          item.id = $(data).find("button").attr("data-idx");
        }
        if ($(data).find("img").attr("src")) {
          item.src = $(data).find("img").attr("src");
        }
        if ($(data).find("img").attr("alt")) {
          item.alt = $(data).find("img").attr("alt");
        }

        // Push items into array
        lookbookItems.push(item);
      });
    });
  });

  // Removed empty item from array
  lookbookItems.shift();

  // Returning array of lookbook items
  return lookbookItems;
};

// Structures lookbook embed
const createLookbookEmbed = async (items: any) => {
  let pages: any = [];

  // Adding introduction page
  const embedIntro = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Lookbook FW20")
    .setURL("https://www.supremenewyork.com/lookbooks")
    .setDescription(
      "Browse through the embed pages to see shots of upcoming items in this Supreme season!"
    );

  // Pushing introductory page
  pages.push(embedIntro);

  // Looping through each item
  items.forEach((item: any) => {
    // Create embed
    const embedPage = new Discord.MessageEmbed().setColor("#5761C9");

    // Checking and inputting dynamic data
    if (item.id) {
      embedPage.setTitle(`Lookbook Item ${parseInt(item.id) + 1}`);
    }
    if (item.alt) {
      embedPage.addField("Item Highlights", item.alt, true);
    }
    if (item.src) {
      embedPage.setImage(`https:${item.src}`);
    }

    // Pushing embed page
    pages.push(embedPage);
  });

  // Return structured embed pages
  return pages;
};
