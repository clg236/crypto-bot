import { addMessage, addReactions, updateScore, getScore, addImage, getAllScores, removeReactions } from "./db.js";
import { processReaction, battlePairs } from "./app.js";
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

app.message("", async ({ message, say }) => {
    if (message && message.text) {
        try {
            let user = await app.client.users.info( { user: message.user })
            // add the message to our database
            addMessage(message.client_msg_id, message.user, user.user.name, message.text)
            await say(`Logging message to db!`);

        } catch (error) {
            console.log(error)
        }
    }
});

app.command('/register', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
    console.log(`${command.text}`);
});

app.command('/score', async ({ command, ack, respond }) => {
    // Acknowledge command request (I have no idea what this is)
    await ack();

    console.log(await app.client.users.list());
    let userScore = await getScore(command.user_id)

    await respond(`<@${command.user_id}>, your score is ${userScore}`);
})

app.command('/battle', async ({ command, ack, respond }) => {
    // Acknowledge command request (I have no idea what this is)
    await ack();

    // get all of our users in the channel (app.client.users.list)
    let users = await app.client.users.list()
    console.log(users.members)
    
    // pass our users list to the battle_pair() function

})

app.command('/allscores', async ({command, ack, respond}) => {
    await ack();
    let scoreDict = await getAllScores();
    let scoreStr = 'Below are all user scores:\n';
    for (const userId in scoreDict) {
        scoreStr += `<@${userId}>: ${scoreDict[userId].score}\n`
    }
    await respond(scoreStr);
})

app.command('/highscores', async ({command, ack, respond}) => {
    await ack();
    let scoreDict = await getAllScores();

    // Create items array
    var items = Object.keys(scoreDict).map(function(key) {
    return [key, scoreDict[key]];
  });
  
  
  for (let item in items) {
    console.log(items[item])

    //our individual scores
    for (let score in items[item]) {
        console.log(items[item][score])
    }

    // Create a new array with only the first 5 items
    //console.log(items.slice(0, 5));

    // say to the channel
    
}



    let scoreStr = 'Below are all user scores:\n';
    for (const userId in scoreDict) {
        scoreStr += `<@${userId}>: ${scoreDict[userId].score}\n`
    }
    await respond(scoreStr);
})

// photo added
app.event('file_shared', async ({event, context, client, say}) => {
    try {
        let user = await app.client.users.info( { user: event.user_id })
        let photo = await app.client.files.info({ file: event.file_id})
        let download = photo.file.url_private_download

        addImage(event.file_id, download, user.user.id, user.user.name);
        
        await say('amazing photo!')
    } catch (error) {
        console.log(error)
    }
})

// reaction added
app.event('reaction_added', async ({event, context, client, say}) => {
    try {
        let user = await app.client.users.info( { user: event.user })

        // reacted User is one that was reacted to
        let reactionDetails = await app.client.reactions.list( { user: event.user })

        // find the correct message and insert our reactions
        const messageId = reactionDetails.items[0].message.client_msg_id
        const reactions = reactionDetails.items[0].message.reactions

        // check that the message has an image
            // check if the user has already reacted to this message?
                // add to the database
        addReactions(messageId, user.user.id, user.user.name, reactions).then(processReaction(user.user.id, event.item_user, true))
        
        // await say('nice reaction!')
    } catch (error) {
        console.log(error)
    }
})

// does the same thing as above, just pushes the array
app.event('reaction_removed', async ({event, context, client, say}) => {
    try {
        console.log(event)
        // reacted User is one that was reacted to
        let reactionDetails = await app.client.reactions.list( { user: event.user })

        // find the correct message and insert our reactions
        // TODO when you remove the only reaction left from a message, it removes ENTIRE MESSAGE from reactionDetails and the following code will give the id of the previous reacted to message
        const messageId = reactionDetails.items[0].message.client_msg_id

        // removeReactions function
        removeReactions(messageId, event.reaction, event.item_user).then(processReaction(event.user, event.item_user, false));
        // await say('awww reaction removed!')
    } catch (error) {
        console.log(error)
    }
})
