require("dotenv").config();
const { AkairoClient, CommandHandler } = require("discord-akairo");

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: "319625873521115138",
      },
      {
        disableMentions: "everyone",
      }
    );

    // Command handler
    this.commandHandler = new CommandHandler(this, {
      directory: "./src/commands/",
      prefix: "!",
    });

    // Load all commands
    this.commandHandler.loadAll();
  }
}

const client = new MyClient();
client.login(process.env.TOKEN);
