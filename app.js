import { app } from "./slack.js";
import { updateScore } from "./db.js";

// start the application
const startApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

startApp();

// application logic

export const processReaction = (reactingUser, reactedUser) => {
  // assumptions:
    // it's easier to react then be reacted to -> reward the content creator more
    updateScore(reactedUser, 100)
    updateScore(reactingUser, 5)

}