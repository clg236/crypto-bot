import { app } from "./slack.js";
import { addUser } from './db.js' // OUR DB CRUD FUNCTIONS

// start the application
const startApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

// addUser('clg236', 'Christian G');
// addUser('alt9035',"Alex T");

startApp();

