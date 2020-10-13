// Imports
import { Command } from 'discord-akairo'
import Discord, { Message } from 'discord.js'
const paginationEmbed = require('discord.js-pagination')

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'commands'],
    })
  }

  pageOne = new Discord.MessageEmbed()
    .setColor('#5761C9')
    .setTitle('Help Menu - Page 1 of 4')
    .setDescription(
      'All commands below must be prefixed with `!`. Arguments are surrounded with `<>`.'
  )
    .setThumbnail('https://cdn.discordapp.com/attachments/735349347796910090/740439415326900305/sneakcord-discord.png')
    .addFields(
      { name: 'About', value: 'Learn about SneakCord.\n!about' },
      {
        name: 'Shopify Scrape',
        value:
          'Scrapes shopify product for available information such as keywords.\n!shopify scrape <product-link>',
      },
      { name: 'Shopify Link Builder', value: 'Builds Shopify cart links using product link.\n!shopify build <store-url> <card-id>' },
      { name: 'Supreme Droplist', value: "Scrapes Supreme's upcoming item droplist.\n!supreme droplist" },
      { name: 'Supreme Droptime', value: "Scrapes Supreme's recent drop time.\n!supreme droptime <region>\nexample: `!supreme droptime us`" },
      { name: 'Supreme Left2Drop', value: "Scrapes Supreme's left2drop items.\n!supreme left2drop" },
    )

  pageTwo = new Discord.MessageEmbed()
    .setColor('#5761C9')
    .setTitle('Help Menu - Page 2 of 4')
    .addFields(
       { name: 'Supreme Lookbook', value: "Scrapes Supreme's recent lookbook.\n!supreme lookbook" },
      { name: 'Supreme Preview', value: "Scrapes Supreme's latest preview.\n!supreme preview" },
      { name: 'Address Changer', value: 'Jigs address for multiple shipping technique.\n!address <address>' },
      { name: 'Currency Exchange', value: 'Calculate currency exchange rates.\n!currency <from-region> <to-region> <amount>\nexample: `!currency USD GBP 100`' },
      { name: 'Delay Calculator', value: 'Calculate ideal delay for botting.\n!delay <#-of-tasks> <#-of-proxies>' },
      { name: 'eBay Viewer', value: 'Sends mass requests to eBay post.\n!ebay <product-listing-url>\n**Set to 50, don\'t spam!**' },
    )

  pageThree = new Discord.MessageEmbed()
    .setColor('#5761C9')
    .setTitle('Help Menu - Page 3 of 4')
    .addFields(
      { name: 'Fee Calculator', value: 'Calculates fees from marketplaces.\n!fees <usd-amount>' },
      { name: 'Flight Club Price Checker', value: 'Search price data from Flight Club.\n!flightclub <search>' },
      { name: 'Funko Price Checker', value: 'Search price data for Funkos.\n!funko <search>' },
      { name: 'Gmail Changer', value: 'Jigs gmail for multiple usages using technique.\n!gmail <gmail>' },
      { name: 'GOAT Price Checker', value: 'Search price data from GOAT.\n!goat <search>' },
      { name: 'Location/Coord Searcher', value: 'Search conversion of coordinates or location.\n!location <address-or-coords>' },
    )

  pageFour = new Discord.MessageEmbed()
    .setColor('#5761C9')
    .setTitle('Help Menu - Page 4 of 4')
    .addFields(
      { name: 'Twitter Lookup', value: 'Lookup Twitter users for data.\n!lookup <user-@>' },
      {
        name: 'Website Pinger',
        value: 'Pings website to check if status is universal, or just you.\n!ping <site-url>',
      },
      { name: 'Stadium Goods Price Checker', value: 'Search price data from Stadium Goods.\n!stadiumgoods <search>' },
      { name: 'StockX Price Checker', value: 'Search price data from StockX.\n!stockx <search>' },
      { name: 'Timestamp Converter', value: 'Convert Discord snowflakes to readable timestamps.\n!timestamp <snowflake>' },
    
    )

  pages = [this.pageOne, this.pageTwo, this.pageThree, this.pageFour]

  exec(message: Message) {
    // Sending embed to requester channel
    return paginationEmbed(message, this.pages)
  }
}

module.exports = HelpCommand
export {}
