import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo"

class MyClient extends AkairoClient {
  readonly commandHandler: CommandHandler
  readonly listenerHandler: ListenerHandler

  constructor() {
    super(
      {
        ownerID: "319625873521115138",
      },
      {
        disableMentions: "everyone",
      }
    )

    // Command handler
    this.commandHandler = new CommandHandler(this, {
      directory: "./src/commands/",
      prefix: "!",
    })

    // Listener handler
    this.listenerHandler = new ListenerHandler(this, {
      directory: "./src/listeners/",
    })

    // Enable handlers
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.loadAll()
    this.commandHandler.loadAll()
  }
}

const client = new MyClient()
client.login("NzQzNTY4OTk2NTMxNTY4Njc1.XzWklw.IdLduLLUyPbXFABNZMoH6hSu3c8")

export { }
