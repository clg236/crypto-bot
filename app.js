require('dotenv').config({
    'path' : __dirname + '/.env'
})

const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.BOT_TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
    port: process.env.PORT || 3000
});

app.message('Hey', async ({ message, say }) => {
    await say(`Hello, <@${message.user}>`);
});

app.message('Bye', async ({ message, say }) => {
    await say(`Goodbye!`);
});

app.command('/register', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
    console.log(`${command.text}`);
});

(async () => {
    // Start your app
    await app.start();

    console.log('⚡️ Bolt app is running!');
})();
