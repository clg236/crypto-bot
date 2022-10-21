// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb6fJ-n0sJIk4nldgEaqLfpBDY9XbdrhY",
  authDomain: "whale-3daba.firebaseapp.com",
  databaseURL: "https://whale-3daba-default-rtdb.firebaseio.com",
  projectId: "whale-3daba",
  storageBucket: "whale-3daba.appspot.com",
  messagingSenderId: "588785321223",
  appId: "1:588785321223:web:2468b26e564341349c71a2",
  measurementId: "G-04DGX728VE"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

function writeUserData(userId, name) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
    });
  }

writeUserData('clg236', 'christian')

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
