# Discord Deleted Users Message Remover

In Discord if a user get's deleted (or the account is closed) the messages of the user won't get deleted from the server.

This script uses Discord.js to search through all text channels configured in the config.json and deletes all messages where the user is a "Deleted User".

## Use in existing discord.js project

```javascript
import { serverCleanerBot } from 'discord-deleted-users-message-remover';

// Configuration
const cleanChannelNames = [];
const excludeChannelNames = ["mods", "welcome"];

// Add the serverCleanerBot function to your client ready function
client.on(Events.ClientReady, async bot => {
    await serverCleanerBot(bot, cleanChannelNames, excludeChannelNames);
});

## Standalone usage

Install [Node.js®](https://nodejs.org/en/download/package-manager) if you haven't already, then clone or download and unzip this repository. After that run `npm i` in the directory containing the files using a shell.

Now [create a discord](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) bot and [add the bot to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).

Rename the `config.example.json` to `config.json` and set the Discord API token of your bot in `token`.

Then configure the list of text channels that you want to clean in `cleanChannelNames`.

Example:

```json
{
    "token": "ThIsIsYouRsecret.disCorD.apI-ToKendoNotShareIt",
    "cleanChannelNames": [
        "welcome",
        "news",
        "memes"
    ],
    "excludeChannelNames": []
}
```

If you want the script to delete the messages of deleted users in all text channels leave the `cleanChannelNames` array empty. You can configure channels to exclude from the run, or leave the `excludeChannelNames` array empty.

Example:

```json
{
    "token": "ThIsIsYouRsecret.disCorD.apI-ToKendoNotShareIt",
    "cleanChannelNames": [],
    "excludeChannelNames": [
        "mods",
        "admins"
    ]
}
```

After the configuration just run the script with node (`node main` or `npm start`). The console output will tell you what is happening.

## Limitations

Currently only text channels can be cleaned. Maybe I will change that in the next version. Just create an issue if you need improvements.

## Discords API rate limits

The Discord API has rate limitations so the script will be slow and pause from time to time if the rate limit is reached. The script will continue after the rate limit is gone. Be patient!

## Why no bulk delete

The script only deletes single messages and does not use a bulk delete feature by design. Bulk deletion of messages is only possible for messages that are not older than 2 weeks (Discord API limitation).
