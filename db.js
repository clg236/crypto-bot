import * as dotenv from 'dotenv'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, update, remove, onValue, orderByChild } from "firebase/database";

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
// saves each separate student to users/userId
export const addUser = (userId, name) => {
    set(ref(db, 'users/' + userId), {
        username: name,
      })
      .then(() => {
        console.log('data saved!')
      })
      .catch((error) => {
        console.log(error);
      });
}

export const addMessage = (id, user, name, messageText) => {
  const message = {
    user: user,
    name: name,
    message: messageText,
  }

  set(ref(db, 'messages/'+ id), {
    message
  }).then(() => {
    console.log('message written');
  }).catch((error) => {
    console.log(error);
  });
}

// Listen for DB changes
const messageRef = ref(db, 'messages/');

onValue(messageRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data)
});
