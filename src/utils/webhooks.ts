const fetch = require("node-fetch");
const randomUseragent = require("random-useragent");

const sendWebhook = async (url: string, payload: any) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": await randomUseragent.getRandom(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

// Export
module.exports.sendWebhook = sendWebhook;
export {};
