require("dotenv").config();
const { AkairoClient } = require("discord-akairo");

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
  }
}

const client = new MyClient();
client.login(process.env.TOKEN);
