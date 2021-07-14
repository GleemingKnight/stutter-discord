const Discord = require('discord.js')

// Initialize Discord
const client = new Discord.Client();

// Put your bot token here
const BOT_TOKEN = "";

// Put the stutter role id here
const ROLE_ID = "";

// Chance of a stutter happening
const STUTTER_CHANCE = 40;

client.on('ready', async () => {
    if(BOT_TOKEN == "") {
        console.log("Please put a bot token in app.js.");
        return;
    }

    if(ROLE_ID == "") {
        console.log("Please put a role id in app.js.");
        return;
    }

    console.log("SutterBot (1.0-SNAPSHOT) has been enabled.");
    console.log(`Bot Token: ${BOT_TOKEN}`);
    console.log(`Role ID: ${ROLE_ID}`);
});

client.on('message', async (msg) => {
    if(msg.webhookID) return;
    if(msg.bot) return;

    // Check if user has stutter role
    if(msg.member.roles.cache.find(r => r.id === ROLE_ID)) {
        let content = "";
        msg.content.split(" ").forEach(a => {
            let chance = Math.floor(Math.random() * 100);

            // Have a 40% chance to stutter
            if(chance < STUTTER_CHANCE) content += a.substring(0, 1) + "-" + a.substring(0, 1);
            else content += a.substring(0, 1);

            // Add the rest of the characters after stutter
            content += a.substring(1, a.length);
            
            // Make a space inbetween words
            content += " ";
        });

        // Delete the users initial message before awaiting
        msg.delete();

        // Fetch the webhook
        let webhooks = await msg.channel.fetchWebhooks();
        let webhook = await webhooks.first();
        
        // Create a webhook if none was found
        if(webhook === undefined) webhook = await msg.channel.createWebhook("Stutter Bot");

        // Send the webhook
        await webhook.send(content, {
            username: msg.author.username,
            avatarURL: msg.author.avatarURL()
        });
    }
});

client.login(BOT_TOKEN);