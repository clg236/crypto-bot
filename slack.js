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
    try {
        console.log(message)
        let user = await app.client.users.info( { user: message.user })
        console.log(user)
        // add the message to our database
        addMessage(message.client_msg_id, message.user, user.user.name, message.text)
        await say(`Logging message to db!`);
    } catch (error) {
        console.log(error)
    }

});

app.command('/register', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
    console.log(`${command.text}`);
});

app.event('reaction_added', async ({event, context, client, say}) => {
    try {
        let user = await app.client.users.info( { user: event.user })
        let reactedUser = await app.client.users.info( { user: event.item_user })
        console.log(user.user.name)
        console.log(reactedUser.user.name)
        await say ('nice reaction!')
    } catch (error) {
        console.log(error)
    }
})
