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
    let textChannels = bot.channels.cache.filter(c => c.type == ChannelType.GuildText);
    let channelsToClean = cleanChannelNames;

    // If no clean channel names are given, clean all text channels that are not excluded by config
    if (channelsToClean.length < 1) {
        channelsToClean = textChannels.filter(c => !excludeChannelNames.includes(c.name)).map(c => c.name);
    }

    for (let cleanChannel of channelsToClean) {
        let cleanChannelId = textChannels.find(c => c.name == cleanChannel).id;
        let channel = await bot.channels.fetch(cleanChannelId);
        if (channel) {
            let last_id = null;
            let counter = 0;
            // Fetch all messages of this channel page by page
            while (1) {
                let messages = await channel.messages.fetch({ limit: 100, before: last_id, cache: false, force: true });
                if (messages) {
                    last_id = messages.last().id;
                    counter += messages.size;
                    console.log(`Queried ${messages.size} (got ${counter} messages total) message of channel #${cleanChannel} from ${last_id} to ${messages.last().id}`);

                    // Delete messages
                    let deleteMessages = messages.filter(m => m.author.username === 'Deleted User' && m.author.id === '456226577798135808');
                    for (let msg of deleteMessages.map(m => m)) {
                        if (msg.deletable) {
                            await msg.delete()
                                .then(dmsg => console.log(`Channel #${cleanChannel}: deleted msg id ${dmsg.id} by ${dmsg.author.username}`))
                                .catch(console.error);
                        }
                        else {
                            console.error(`Channel #${cleanChannel}: msg id ${msg.id} by ${msg.author.username} can not be deleted`);
                        }
                    }
                    // Prevent GET method is rate limited
                    await new Promise(resolve => setTimeout(resolve, 750));
                }
                else {
                    console.log(`Finished cleaning of channel #${cleanChannel}`);
                    break;
                }
            }
        }
    }
    process.exit(0);
});

// Start bot
client.login(token);
