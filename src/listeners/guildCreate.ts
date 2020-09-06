// Imports
import { Listener } from "discord-akairo";
import fetch from "node-fetch";

import { sendWebhook } from "../utils/webhooks";

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
        console.log(`Authenticated server ${guild.name}`);

        // Send webhook
        sendWebhook(
          "https://discordapp.com/api/webhooks/750166466766307408/KeXxORemtzUhmHYmBF095_T1uoi7aXmqOPEsiz5mcqu7SwyJ7NCnzpxSuEEfPMdMX_06",
          {
            embeds: [
              {
                title: "Core Authentication",
                description: `Tests passed`,
                color: 5726665,
                fields: [
                  {
                    name: "Name",
                    value: guild.name,
                  },
                  {
                    name: "ID",
                    value: guild.id,
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
      } else {
        console.log(`Failed authenticating server ${guild.name}`);

        // Ejecting Core instance
        guild
          .leave()
          .then((guild: any) => console.log(`Left the guild ${guild}`))
          .catch(console.error);

        // Send webhook
        sendWebhook(
          "https://discordapp.com/api/webhooks/750166466766307408/KeXxORemtzUhmHYmBF095_T1uoi7aXmqOPEsiz5mcqu7SwyJ7NCnzpxSuEEfPMdMX_06",
          {
            embeds: [
              {
                title: "Core Authentication",
                description: `Tests failed`,
                color: 5726665,
                fields: [
                  {
                    name: "Name",
                    value: guild.name,
                  },
                  {
                    name: "ID",
                    value: guild.id,
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
      }
    } else {
      console.log(`Error: ${error}`);
    }
  }
}

module.exports = GuildCreateListener;
export {};
