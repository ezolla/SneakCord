// Imports
import { Listener } from "discord-akairo";

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }

  exec() {
    console.log("SneakCord is running!");

    this.client.user!.setStatus("online");
    this.client.user!.setActivity("!help | sneakcord.com", {
      type: "PLAYING",
    });
  }
}

module.exports = ReadyListener;
export {};
