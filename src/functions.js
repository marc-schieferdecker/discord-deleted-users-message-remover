import { ChannelType } from 'discord.js';

/**
 * Delete all messages of 'Deleted User's in all text channels
 * @param {Client} discordjs client
 * @param {array} array containing channel names to clean, empty array to clean all text channels
 * @param {array} array containing channel names to ignore 
 * @param {bool} logging 
 */
export async function serverCleanerBot(bot, cleanChannelNames, excludeChannelNames, logging = true) {
    // Disable/enable logging output to console
    const logFn = logging ? console.log : () => { };

    logFn('Running discord server cleaner');

    // Get all text channels of the server
    let textChannels = bot.channels.cache.filter(c => c.type == ChannelType.GuildText);
    let channelsToClean = cleanChannelNames;

    // If no clean channel names are given, clean all text channels that are not excluded by config
    if (channelsToClean.length < 1) {
        channelsToClean = textChannels.filter(c => !excludeChannelNames.includes(c.name)).map(c => c.name);
    }

    // Clean channels
    for (let cleanChannel of channelsToClean) {
        let cleanChannelId = textChannels.find(c => c.name == cleanChannel).id;
        let channel = await bot.channels.fetch(cleanChannelId);
        if (channel) {
            let last_id = null;
            let counter = 0;
            // Fetch all messages of this channel page by page
            while (1) {
                let messages = await channel.messages.fetch({ limit: 100, before: last_id, cache: false, force: true });
                if (messages.size > 0) {
                    last_id = messages.last().id;
                    counter += messages.size;
                    logFn(`Queried ${messages.size} (got ${counter} messages total) message of channel #${cleanChannel} from ${last_id} to ${messages.last().id}`);

                    // Delete messages
                    let deleteMessages = messages.filter(m => m.author.username === 'Deleted User' && m.author.id === '456226577798135808');
                    for (let msg of deleteMessages.map(m => m)) {
                        if (msg.deletable) {
                            await msg.delete()
                                .then(dmsg => logFn(`Channel #${cleanChannel}: deleted msg id ${dmsg.id} by ${dmsg.author.username}`))
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
                    logFn(`Finished cleaning of channel #${cleanChannel}`);
                    break;
                }
            }
        }
    }
}