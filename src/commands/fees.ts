const Discord = require("discord.js");
const { Command } = require("discord-akairo");

class FeesCommand extends Command {
  constructor() {
    super("fees", {
      aliases: ["fees", "fee"],
      args: [
        {
          id: "price",
          type: "number",
        },
      ],
    });
  }

  exec(message: any, args: any) {
    if (args.price) {
      const results = calculateFees(args.price);

      const embed = new Discord.MessageEmbed().setColor("#5761C9").addFields(
        {
          name: "Paypal (3.9% + $0.30)",
          value: "$" + results.paypal.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Ebay (10% + 2.9%)",
          value: "$" + results.ebay.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Goat (9.5% + $5)",
          value: "$" + results.goat.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Grailed (6% + 2.9%)",
          value: "$" + results.grailed.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Stockx Level 1 (9.5%)",
          value: "$" + results.stockx1.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Stockx Level 2 (9.0%)",
          value: "$" + results.stockx2.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Stockx Level 3 (8.5%)",
          value: "$" + results.stockx3.toFixed(2).toString(),
          inline: true,
        },
        {
          name: "Stockx Level 4 (8.0%)",
          value: "$" + results.stockx4.toFixed(2).toString(),
          inline: true,
        }
      );

      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed().setColor("#5761C9").addFields(
        {
          name: "Paypal",
          value: "3.9% + $0.30",
          inline: true,
        },
        {
          name: "Ebay",
          value: "10% + 2.9%",
          inline: true,
        },
        {
          name: "Goat",
          value: "9.5% + $5",
          inline: true,
        },
        {
          name: "Grailed (6% + 2.9%)",
          value: "6% + 2.9%",
          inline: true,
        },
        {
          name: "Stockx Level 1",
          value: "9.5%",
          inline: true,
        },
        {
          name: "Stockx Level 2",
          value: "9.5%",
          inline: true,
        },
        {
          name: "Stockx Level 3",
          value: "8.5%",
          inline: true,
        },
        {
          name: "Stockx Level 4",
          value: "8.0%",
          inline: true,
        }
      );

      return message.channel.send(embed);
    }
  }
}

module.exports = FeesCommand;
export {};

const calculateFees = (price: any) => {
  // Defining fee rates
  let paypal = price * 0.039 + 0.3;
  let ebay = price * 0.1 + price * 0.029;
  let goat = price * 0.095 + 5.0;
  let grailed = price * 0.06 + price * 0.029;
  let stockx1 = price * 0.095;
  let stockx2 = price * 0.09;
  let stockx3 = price * 0.085;
  let stockx4 = price * 0.08;

  // Calculating fees
  paypal = price - paypal;
  ebay = price - ebay;
  goat = price - goat;
  grailed = price - grailed;
  stockx1 = price - stockx1;
  stockx2 = price - stockx2;
  stockx3 = price - stockx3;
  stockx4 = price - stockx4;

  // Return fees
  return { paypal, ebay, goat, grailed, stockx1, stockx2, stockx3, stockx4 };
};
