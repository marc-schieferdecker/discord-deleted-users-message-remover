import { Client, Events, GatewayIntentBits } from 'discord.js';
import { serverCleanerBot } from './src/functions.js';
import { createRequire } from "module";
const config = createRequire(import.meta.url)("./config.json");

/**
 * Create discord client
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


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
    await serverCleanerBot(bot, config.cleanChannelNames, config.excludeChannelNames);
    process.exit(0);
});

/**
 * Login bot with token
 */
client.login(config.token);
