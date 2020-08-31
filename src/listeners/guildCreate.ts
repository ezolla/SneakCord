const { Listener } = require("discord-akairo");
const fetch = require("node-fetch");

class GuildCreateListener extends Listener {
  constructor() {
    super("guildCreate", {
      emitter: "client",
      event: "guildCreate",
    });
  }

  async exec(guild: any, error: any) {
    if (!error) {
      console.log("Guild create event triggered");

      // Authenticate server
      const result = await fetch("http://localhost:4000/api/admin/servers", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": "zI!6dBu!%74ApY6^9lSe",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
        },
        body: JSON.stringify({
          id: guild.id,
        }),
      });

      if (result.status === 200) {
        console.log(`Status: ${result.status}`);
      } else {
        console.log("Failed authenticating server");

        // Ejecting Core instance
        guild
          .leave()
          .then((guild: any) => console.log(`Left the guild ${guild}`))
          .catch(console.error);
      }
    } else {
      console.log(`Error: ${error}`);
    }
  }
}

module.exports = GuildCreateListener;
export {};
