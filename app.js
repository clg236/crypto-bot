import { app } from "./slack.js";
import { updateScore } from "./db.js";

// start the application
const startApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

startApp();

// application logic

export const processReaction = (reactingUser, reactedUser, isAdded) => {
  // assumptions:
    // it's easier to react then be reacted to -> reward the content creator more
    if (isAdded) {
      updateScore(reactedUser, 100)
      updateScore(reactingUser, 5)
    } else {
      updateScore(reactedUser, -100)
      updateScore(reactingUser, -5)
    }


}

export const battlePairs = (users) => {
  // get a count of the user number
  let userCount = users.length()
  console.log(`we have ${userCount} users`)
}


// utils
const createGroups = (users) => {
  let testUsers = [
    'christian',
    'alex',
    'bob',
    'fred',
    'sally',
    'uber',
  ]

  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    //pick a random element
    let randomindex = Math.floor(Math.random())
  }
}