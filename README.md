# Discord Deleted Users Message Remover

In Discord if a user get's deleted (or the account is closed) the messages of the user won't get deleted from the server.

This script uses Discord.js to search through all text channels configured in the config.json and deletes all messages where the user is a "Deleted User".

## Usage

Rename the `config.example.json` to `config.json` and set the Discord API token in `token` ([how to create a token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)).

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