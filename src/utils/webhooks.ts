const fetch = require("node-fetch");

const sendWebhook = async (url: string, payload: any) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

// Export
module.exports.sendWebhook = sendWebhook;
export {};
