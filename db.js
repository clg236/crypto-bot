import * as dotenv from 'dotenv'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };

const firebase = initializeApp(firebaseConfig); //todo: can we error out if there's an issue initializing the DB?

//our db ref
const db = getDatabase();

// write data to a server (overwrite existing record if it exists)
export const addUser = (userId, name) => {
    set(ref(db, 'users/' + userId), {
        username: name,
        messages: {},
      })
      .then(() => {
        console.log('data saved!')
      })
      .catch((error) => {
        console.log(error)
      });
}

export const writeMessage = (userId, time, text) => {
  // how we store messages
  const messageData = {
    message: text,
  }

  // add to the user's URL or to the messages array?
}

// read data from server 
const usersRef = ref(db, 'users/');
// logs everytime a change occurs
onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  console.log("Data read!");
})

