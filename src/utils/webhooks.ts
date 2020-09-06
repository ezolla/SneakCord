// Imports
import fetch from "node-fetch";
import randomUseragent from "random-useragent";

export const sendWebhook = async (url: string, payload: any) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": await randomUseragent.getRandom()!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
