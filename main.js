const { Client, Events, GatewayIntentBits, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { token, cleanChannelNames, excludeChannelNames } = require('./config.json');

/**
 * Output debug information about rate limits
 */
client.rest.on('rateLimited', rateLimitData => {
    console.log(`rateLimit for method ${rateLimitData.method} reached. Waiting ${rateLimitData.limit} seconds.`);
});

/**
 * Run server cleaner
 */
client.on(Events.ClientReady, async bot => {
    console.log('Running discord server cleaner');
    let textChannels = client.channels.cache.filter(c => c.type == ChannelType.GuildText);
    let channelsToClean = cleanChannelNames;

    // If no clean channel names are given, clean all text channels that are not excluded by config
    if (channelsToClean.length < 1) {
        channelsToClean = textChannels.filter(c => !excludeChannelNames.includes(c.name)).map(c => c.name);
    }

    for (let cleanChannel of channelsToClean) {
        let cleanChannelId = textChannels.find(c => c.name == 'news').id;
        let channel = await bot.channels.fetch(cleanChannelId);
        if (channel) {
            let last_id = null;
            let counter = 0;
            while (1) {
                try {
                    let messages = await channel.messages.fetch({ limit: 100, before: last_id });
                    counter += messages.size;
                    console.log(`Queried ${messages.size} (got ${counter} messages total) message of channel #${cleanChannel} from ${last_id} to ${messages.last().id}`);
                    for (let msg of messages.map(m => m)) {
                        last_id = msg.id;
                        if (msg.author.username === 'Deleted User' && msg.author.id === '456226577798135808') {
                            if (!msg.deleted) {
                                console.log(`Channel #${cleanChannel}: delete msg id ${msg.id} by ${msg.author.username}`);
                                await msg.delete();
                            }
                        }
                    }
                    // Prevent GET method is rate limited
                    await new Promise(resolve => setTimeout(resolve, 750));
                }
                catch (ex) {
                    console.warn(ex);
                    break;
                }
            }
        }
    }
    process.exit(0);
});

// Start bot
client.login(token);
