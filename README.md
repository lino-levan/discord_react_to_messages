# DRTAM (Discord React To All Messages)

DRTAM is a small demo of self-botting in discord for the usecase of reacting to all messages in a channel. Why would you want to do this? Is this helpful in any way? No. Not particularly. But it was interesting to make so here it is.

## Running

First download the script:

```bash
$ git clone https://github.com/lino-levan/discord_react_to_messages
$ cd discord_react_to_messages
```

Then edit the config with the values that you want:

```bash
$ nano config.yaml
```

Lastly just run the script with [Deno](https://deno.land).

```bash
$ deno run --allow-net --allow-read react.ts
```

## FAQ

### How do I get channel / guild IDs?

Follow [this tutorial](https://www.howtogeek.com/714348/how-to-enable-or-disable-developer-mode-on-discord/) on enabling developer mode and then just right click on the channel / server and select "Copy ID".

### How do I get my Auth Token / Super Properties?

This one is definitely more challenging (and for good reason). Here are the basic steps, though they may change over time:

- Enable developer mode in your browser
- Login to discord in that browser
- Open up inspect element
- Go to the network tab
- Clear all previous network requests
- React to a message
- Look for the event by the name "@me" and go to headers
- You should see a header called "Authorization" and a header called "X-Super-Properties"
- Copy and paste those into `config.yaml`

### Will I get banned for using this?

Maybe? It's against TOS for sure. I'm not really sure if this is a bannable offense though I definitely wouldn't recommend abusing this. I should note that I'm not sending cookies which would definitely be a red flag from discord's side so I'd be careful doing anything else than just running this once to experiment. 