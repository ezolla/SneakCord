const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require("discord-akairo");
const fetch = require("node-fetch");

const { sendWebhook } = require("./utils/webhooks");

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
client.login("NzQwNDI1MjIxODYxMDE1NTcy.Xyo0uQ.ecRS65_njM_2i9SZHH4QctHaPfg");

// Authentication checking every minute
client.setInterval(async () => {
  console.log("Authentication check");

  // Send webhook
  sendWebhook(
    "https://discordapp.com/api/webhooks/750166466766307408/KeXxORemtzUhmHYmBF095_T1uoi7aXmqOPEsiz5mcqu7SwyJ7NCnzpxSuEEfPMdMX_06",
    {
      embeds: [
        {
          title: "Authentication check has started",
          description: `Started testing on all live server`,
          color: 5726665,
          footer: {
            text: "SneakCord",
            icon_url:
              "https://cdn.discordapp.com/attachments/735349347796910090/740439415326900305/sneakcord-discord.png",
          },
          timestamp: new Date(),
        },
      ],
    }
  );

  // Retrieve list of active servers
  let servers = await client.guilds.cache.keyArray();

  // For each server, check authentication
  servers.forEach(async (server: any) => {
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
        id: server,
      }),
    });

    if (result.status === 200) {
      console.log(`Authenticated server ${server}`);
    } else {
      console.log(`Failed authenticating server ${server}`);

      // Ejecting Core instance
      client.guilds
        .fetch(server)
        .then((guild: any) => {
          console.log(guild.name);

          // Leave server
          guild.leave().then((guild: any) => {
            console.log(`Left the guild ${guild}`);

            // Send webhook
            sendWebhook(
              "https://discordapp.com/api/webhooks/750166466766307408/KeXxORemtzUhmHYmBF095_T1uoi7aXmqOPEsiz5mcqu7SwyJ7NCnzpxSuEEfPMdMX_06",
              {
                embeds: [
                  {
                    title: "Core Authentication",
                    description: `Authentication tests failed on this server.`,
                    color: 5726665,
                    fields: [
                      {
                        name: "ID",
                        value: server,
                      },
                    ],
                    footer: {
                      text: "SneakCord",
                      icon_url:
                        "https://cdn.discordapp.com/attachments/735349347796910090/740439415326900305/sneakcord-discord.png",
                    },
                    timestamp: new Date(),
                  },
                ],
              }
            );
          });
        })
        .catch(console.error);
    }
  });
}, 60 * 60 * 1000);

export {};
