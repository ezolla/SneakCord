// Imports
import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

class SupremeCommand extends Command {
  constructor() {
    super("supreme", {
      aliases: ["supreme", "sup", "preme"],
      description: {
        content: "Supreme",
        usage: "supreme",
        examples: ["supreme"],
      },
    });
  }
  *args() {
    const method = yield {
      type: [
        ["supreme-droplist", "droplist", "drop", "list"],
        ["supreme-sellout", "sellout", "times"],
        [
          "supreme-left2drop",
          "left2drop",
          "left",
          "lefttodrop",
          "left-2-drop",
          "left-to-drop",
        ],
        ["supreme-preview", "preview"],
        ["supreme-lookbook", "lookbook"],
      ],
      otherwise: () => {
        return new MessageEmbed()
          .setColor("#5761C9")
          .setTitle("Supreme help embed");
      },
    };

    return Flag.continue(method);
  }
}

module.exports = SupremeCommand;
export {};
