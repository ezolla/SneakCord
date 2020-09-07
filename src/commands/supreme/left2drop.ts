// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import rp from "request-promise";
import cheerio from "cheerio";
import Table from "easy-table";

class SupremeLeft2DropCommand extends Command {
  constructor() {
    super("supreme-left2drop", {
      category: "flag",
      description: {
        content: "Scrapes Supreme left2drop",
        usage: "left2drop",
        examples: ["left2drop"],
      },
    });
  }
  async exec(message: Message) {
    let items: any;

    // Fetch all data
    try {
      // Fetching left2drop
      items = await getLeft2Drop();
    } catch (err) {
      console.log(err);
    }

    // Create and structure embed
    let embed = await createLeft2DropEmbed(items);

    // Sending embed to requester channel
    message.channel.send(embed);
  }
}

module.exports = SupremeLeft2DropCommand;
export {};

// Request options
const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches left2drop data
const getLeft2Drop = async () => {
  let leftItems: any = [];

  // Converting response to html
  const $ = await rp(
    options(
      "https://www.supremecommunity.com/season/fall-winter2020/lefttodrop/"
    )
  );

  // Scrape section headings
  $(".l2d-title").each((index: any, data: any) => {
    let item: any = { id: 1 };

    // Scrape available data
    if (index) {
      item.id = index + 1;
    }
    if ($(data).text()) {
      item.category = $(data).text().split(" ")[0].slice(0, -1);
      item.count = $(data).text().split(" ")[
        $(data).text().split(" ").length - 1
      ];
    }

    // Push items into array
    leftItems.push(item);
  });

  // Returning array of lookbook items
  return leftItems;
};

// Structures left2drop embed
const createLeft2DropEmbed = async (items: any) => {
  let tableData: any = [];

  // Adding introduction page
  const embed = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme FW20 Left2Drop")
    .setURL(
      "https://www.supremecommunity.com/season/fall-winter2020/lefttodrop/"
    )
    .setDescription(
      "Browse through the embed pages to see item categories and their associated item count remaining. Click the link for more details."
    );

  // Parsing items and filling table
  if (items) {
    items.forEach((item: any) => {
      tableData.push({ category: item.category, count: item.count });
    });

    let t = new Table();

    tableData.forEach((pair: any) => {
      t.cell("Category", pair.category);
      t.cell("Count", pair.count);
      t.newRow();
    });

    embed.addField("Left to Drop", `\`\`\`${t}\`\`\``, false);
  }

  // Return structured embed
  return embed;
};
