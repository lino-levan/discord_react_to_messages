import { parse } from "https://deno.land/std@0.182.0/yaml/parse.ts"

interface Config {
  guild_id: string,
  channel_id: string,
  reaction: string,
  authorization: string,
  super_properties: string
}

const config = parse(Deno.readTextFileSync("config.yaml")) as Config

// Little wrapper arouind fetch to make things easier
async function rfetch(path: string, referrer: string, method: string) {
  return await fetch(`https://discord.com/api/v9/${path}`, {
    "cache": "default",
    "credentials": "include",
    "headers": {
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Authorization": config.authorization,
      "Priority": "u=3, i",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15",
      "X-Debug-Options": "bugReporterEnabled",
      "X-Discord-Locale": "en-US",
      "X-Super-Properties": config.super_properties,
    },
    "method": method,
    "mode": "cors",
    "redirect": "follow",
    "referrerPolicy": "strict-origin-when-cross-origin",
    referrer,
  });
}

// Get the initial batch of messages
let messages = await (await rfetch(
  `channels/${config.channel_id}/messages?limit=50`,
  `https://discord.com/channels/${config.channel_id}`,
  "GET",
)).json();

while (messages.length > 0) {
  // React to all of the messages
  for (const message of messages) {
    console.log(`Reacting to message "${message.id}" with reaction ${config.reaction}`)
    await rfetch(
        `channels/${config.channel_id}/messages/${message.id}/reactions/${
          encodeURIComponent(config.reaction)
        }/%40me?location=Message&type=0`,
        `https://discord.com/channels/${config.guild_id}/${config.channel_id}`,
        "PUT",
    )

    // Sleep a little bit so that discord doesn't get sus
    await new Promise((r) => setTimeout(r, 100 + (Math.random() * 300)));
  }

  // Then fetch a new batch of messages to react to
  if (messages.length === 50) {
    messages = await (await rfetch(
      `channels/${config.channel_id}/messages?limit=50&before=${
        messages[messages.length - 1].id
      }`,
      `https://discord.com/channels/${config.channel_id}`,
      "GET",
    )).json();
  } else {
    // Obviously no more messages if the last batch returned less than 50
    messages = [];
  }
}
