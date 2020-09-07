// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";
const paginationEmbed = require("discord.js-pagination");

class SupremePreviewCommand extends Command {
  constructor() {
    super("supreme-preview", {
      category: "flag",
      description: {
        content: "Scrapes Supreme preview",
        usage: "preview",
        examples: ["preview"],
      },
    });
  }
  async exec(message: Message) {
    let items: any;

    // Fetch all data
    try {
      items = await getPreview();
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createPreviewEmbed(items);

    // Sending embed to requester channel
    return paginationEmbed(message, embed);
  }
}

module.exports = SupremePreviewCommand;
export {};

// Request options
const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches preview data
const getPreview = async () => {
  let previewItems: any = [];

  // Converting response to html
  const $ = await rp(
    options("https://www.supremenewyork.com/previews/fallwinter2020")
  );

  // Loop through preview items
  $("#container li").each((index: any, data: any) => {
    let item: any = { id: 1 };

    // Scrape available data
    if (index) {
      item.id = index + 1;
    }
    if (cheerio.load(data).root().find("a").attr("href")) {
      item.href = cheerio.load(data).root().find("a").attr("href");
    }
    if ($(data).find("img").attr("src")) {
      item.src = $(data).find("img").attr("src");
    }

    // Push items into array
    previewItems.push(item);
  });

  // Returning array of lookbook items
  return previewItems;
};

// Structures preview embed
const createPreviewEmbed = async (items: any) => {
  let pages: any = [];

  // Adding introduction page
  const embedIntro = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Preview FW20")
    .setURL("https://www.supremenewyork.com/previews/fallwinter2020")
    .setDescription(
      "Browse through the embed pages to see groups of upcoming items in this Supreme season!"
    );

  // Pushing introductory page
  pages.push(embedIntro);

  // Looping through each item
  items.forEach((item: any) => {
    // Create embed
    const embedPage = new Discord.MessageEmbed().setColor("#5761C9");

    // Checking and inputting dynamic data
    if (item.id) {
      embedPage.setTitle(
        `Preview Group ${item.id} - ${
          item.href.split("/")[3].replace("-", " ").charAt(0).toUpperCase() +
          item.href.split("/")[3].replace("-", " ").slice(1)
        }`
      );
    }
    if (item.href) {
      embedPage.setURL(`https://www.supremenewyork.com${item.href}`);
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
