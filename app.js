import { app } from "./slack.js";

// start the application
const startApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

startApp();

// application logic
