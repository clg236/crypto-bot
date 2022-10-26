import { addMessage, addUser } from "./db.js";
import { createRequire } from "module";
import * as dotenv from 'dotenv'
const require = createRequire(import.meta.url);
dotenv.config()

const { App } = require('@slack/bolt');

export const app = new App({
    token: process.env.BOT_TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
    port: process.env.PORT || 3000
});

// our SLACK API calls
app.message('Hello', async ({ message, say }) => {
    await say(`Hello, <@${message.user}>`);
});

app.message('Bye', async ({ message, say }) => {
    await say(`Goodbye!`);
});

app.message("", async ({ message, say }) => {
    addUser(message.user, "name unknown");
    addMessage(message.user, message.time, message.text, 0);
    await say(`Logging message to db!`);
});

app.command('/register', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
    console.log(`${command.text}`);
});

