import { app } from "./slack.js";
import { writeData } from './db.js' // OUR DB CRUD FUNCTIONS

// start the application
const startApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

writeData('clg236', 'Christian Grewell')
startApp();

