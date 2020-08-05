require("dotenv").config();
const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require("discord-akairo");

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

    // Listener handler
    this.listenerHandler = new ListenerHandler(this, {
      directory: "./src/listeners/",
    });

    // Enable handlers
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
  }
}

const client = new MyClient();
client.login(process.env.TOKEN);
