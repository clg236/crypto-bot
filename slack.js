import { addMessage, addUser, addReactions, updateScore } from "./db.js";
import { processReaction } from "./app.js";
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

// reaction added
app.event('reaction_added', async ({event, context, client, say}) => {
    try {
        console.log(event)
        let user = await app.client.users.info( { user: event.user })

        // reacted User is one that was reacted to
        let reactedUser = await app.client.users.info( { user: event.item_user })
        let reactionDetails = await app.client.reactions.list( { user: event.user })

        // find the correct message and insert our reactions
        const messageId = reactionDetails.items[0].message.client_msg_id
        const reactions = reactionDetails.items[0].message.reactions

        // add to the database
        addReactions(messageId, user.user.id, user.user.name, reactions).then(processReaction(user.user.id, reactedUser.user.id))
        

        
        
        await say('nice reaction!')
    } catch (error) {
        console.log(error)
    }
})

// does the same thing as above, just pushes the array
app.event('reaction_removed', async ({event, context, client, say}) => {
    try {
        console.log(event)
        let user = await app.client.users.info( { user: event.user })

        // reacted User is one that was reacted to
        let reactedUser = await app.client.users.info( { user: event.item_user })
        let reactionDetails = await app.client.reactions.list( { user: event.user })

        // find the correct message and insert our reactions
        const messageId = reactionDetails.items[0].message.client_msg_id
        const reactions = reactionDetails.items[0].message.reactions

        // removeReactions function
        await say('awww reaction removed!')
    } catch (error) {
        console.log(error)
    }
})
