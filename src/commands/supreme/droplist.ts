// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";
const paginationEmbed = require("discord.js-pagination");

class SupremeDroplistCommand extends Command {
  constructor() {
    super("supreme-droplist", {
      category: "flag",
      description: {
        content: "Scrapes upcoming Supreme droplist",
        usage: "droplist",
        examples: ["droplist"],
      },
    });
  }
  async exec(message: Message) {
    let droplist, items: any;

    // Fetch all data
    try {
      // Fetching recent droplist
      droplist = await getDroplist();

      // Fetching droplist items
      items = await getItems(droplist);
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createDroplistEmbed(items, droplist);

    // Sending embed to requester channel
    return paginationEmbed(message, embed);
  }
}

module.exports = SupremeDroplistCommand;
export {};

// Request options
const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches recent droplist
const getDroplist = async () => {
  // Sending GET request to droplists page
  const $ = await rp(
    options("https://www.supremecommunity.com/season/latest/droplists/")
  );

  const path = $("a.block").first().attr("href");

  // Returning latest droplist URL
  return `https://www.supremecommunity.com/${path}`;
};

// Fetches droplist items
const getItems = async (droplist: string) => {
  let items: any = [];

  // Converting response to html
  const $ = await rp(options(droplist));

  // Get all of the items
  const dropItems = await $(".card.card-2");

  // Loop through each item
  dropItems.each((index: any, element: any) => {
    let data: any = {};

    // Item ID
    data.id = index + 1;

    // Adding dynamic data if availabe
    if ($(element).find("h2").text()) {
      data.name = $(element).find("h2").text();
    }
    if ($(element).find(".label-price").text()) {
      data.price = $(element).find(".label-price").text().trim();
    }
    if ($(element).find("img").attr("src")) {
      data.image = $(element).find("img").attr("src");
    }
    if ($(element).find("img").attr("alt")) {
      data.description = $(element).find("img").attr("alt").split(" - ")[1];
    }
    if ($(element).find(".category").text()) {
      data.category = $(element).find(".category").text();
    }
    if ($(element).find(".upvotes").text()) {
      data.upvotes = $(element).find(".upvotes").text();
    }
    if ($(element).find(".downvotes").text()) {
      data.downvotes = $(element).find(".downvotes").text();
    }

    // Push items into array
    items.push(data);
  });

  // Returning array of drop items
  return items;
};

// Structures droplist embed
const createDroplistEmbed = async (items: any, droplist: any) => {
  let pages: any = [];

  // Adding introduction page
  const embedIntro = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Droplist")
    .setURL(droplist)
    .setDescription(
      "Browse through the embed pages to see all upcoming items from this week's drop! Community popularity rankings goes from greatest to least."
    );

  // Pushing introductory page
  pages.push(embedIntro);

  // Looping through each item
  items.forEach((item: any) => {
    // Create embed
    const embedPage = new Discord.MessageEmbed().setColor("#5761C9");

    // Checking and inputting dynamic data
    if (item.name) {
      embedPage.setTitle(item.name);
    }
    if (item.description) {
      embedPage.setDescription(item.description);
    }
    if (item.image) {
      embedPage.setImage(`https://www.supremecommunity.com${item.image}`);
    }
    if (item.price) {
      embedPage.addField("Price", item.price, true);
    }
    if (item.category) {
      embedPage.addField(
        "Category",
        `${item.category.charAt(0).toUpperCase()}${item.category.slice(1)}`,
        true
      );
    }
    if (item.upvotes) {
      embedPage.addField("Upvotes", item.upvotes, true);
    }
    if (item.downvotes) {
      embedPage.addField("Downvotes", item.downvotes, true);
    }

    // Pushing embed page
    pages.push(embedPage);
  });

  // Return structured embed pages
  return pages;
};
