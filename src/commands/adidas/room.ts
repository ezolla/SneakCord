// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import randomUseragent from "random-useragent";

class AdidasRoomCommand extends Command {
  constructor() {
    super("adidas-room", {
      category: "flag",
      description: {
        content: "Scrapes Adidas product room status",
        usage: "room",
        examples: ["room"],
      },
      args: [
        {
          id: "pid",
          type: "string",
        },
      ],
    });
  }
  async exec(message: Message, args: any) {
    if (args.pid.length === 6) {
      let data, embed: any;

      try {
        // Fetching product
        data = await getData(args.pid);
      } catch (error) {
        console.log(error);
      }

      // Verifying we have data
      if (data !== undefined) {
        // Create and structure embed
        embed = await createEmbed(data);

        // Sending embed to requester channel
        return message.channel.send(embed);
      }
    } else {
      // Create error embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give argument");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = AdidasRoomCommand;
export {};

// Fetches product data
const getData = async (pid: string) => {
  // Sending GET request to product endpoint
  const response = await fetch(`https://www.adidas.com/api/products/${pid}`, {
    method: "GET",
    headers: {
      Cookie:
        "geo_ip=98.247.45.153; badab=false; ak_bmsc=410D7707E1ECBE368A90BCB2D713E0CF17202E4CB53E00008D12575FDA4AB34E~plk++escxptGm9GSrVJBHNY0Q7RjD7m2sGnS3vjivypOwrFy/Txt2pZmmVWn50T0OFdMLy1jQF6to6AO6GBxTI6QdYUpWPo0c2jZlo0LZx2ICOHBGE1mKBYKmct2oGFhcdKDtSWTQFs9hqzHJqIFHwpVaY8wp5jdcNlfv2G12E7OkvWLt6g9wT0G2XLKqlnvWcd4VK0uOX+DIj5nJ/DnNgnc/NQQ9qHTBI0N+DdZ78KApRpYj7IpoYujLklEgUZ3XLuqVE61W36TcLBLadqjPDK6PUzFoaXQJJ64JpN8l2rteVuD6FzCY2q+8/r9Ze06jUUI/Cg0+ak7xxPM1hY2niTg==; akacd_phasedRC_FI_us_prod=3776994700~rv=61~id=1d4f8e7af4db680510cab8763342802a; bm_sz=D3B84C98E35F2D1297AAC107818CE8A4~YAAQTC4gFyzJz2t0AQAAZncgbAn8hBL8Ij9uHlsychfcyzHvo021h+j4aUxXLvdVQ2CDznLcvx5MYyHEN85Uzl60P3zZl/h6DRI3FsncF151HvXNUIPK70aJzgUC+u5lFnR5pSjpzIQggmsFe6oZuscWAmZ1j7W11zbeDvkRKrgetclfl5McLnizmPf/5dtc; _abck=9692AEC62E3B70D42E7733C8F463CC8D~-1~YAAQTC4gFy3Jz2t0AQAAZncgbARbBsxcURLknlYKpGQBPveECZ8Dd7e6EHFJOiQ1d2KmbAEdcxdebhtyQ/QRShvrEoc2tmTGUfbcDbDrN8chnCRk4YAhVyX83LWDmIsIQRnq7qCGMYgfVyZotVQPGRragLa+lp0SgyG8SYSHZIbZ0lGD8e1w+sbjqu7zzEmLNa5TmLWI2MEqrXIO3KaAeq97+Bz0KOxntqmH2yBFQLlqMmQvlLNvoVL9xvnhu/TpfREqhF9LWzjgTnQG1U9Y+FJTcOcsY/WkbD4sNiJpw4i30jtY5rlFzItT~-1~-1~-1",
      Accept: "application/json",
      "User-Agent": randomUseragent.getRandom()!,
      "Content-Type": "application/json",
    },
  });

  // Checking response status
  if (response.status === 200) {
    // Translating response to JSON
    const data = await response.json();

    // Returning product data
    return data;
  }
};

// Structures embed
const createEmbed = async (data: any) => {
  // Create embed
  const embed = new Discord.MessageEmbed().setColor("#5761C9");

  // Checking for availabe data to add
  if (data.name) {
    embed.setTitle(data.name);
  }
  if (data.product_description.subtitle) {
    embed.setDescription(data.product_description.subtitle);
  }
  if (data.meta_data.canonical) {
    embed.setURL(`https:${data.meta_data.canonical}`);
  }
  if (data.product_description.description_assets.image_url) {
    embed.setThumbnail(data.product_description.description_assets.image_url);
  }
  if (data.id) {
    embed.addField("PID", data.id, true);
  }
  if (data.attribute_list.isWaitingRoomProduct) {
    embed.addField(
      "Waiting Room",
      data.attribute_list.isWaitingRoomProduct,
      true
    );
  } else {
    embed.addField("Waiting Room", "false", true);
  }

  // Returning structured embed
  return embed;
};
