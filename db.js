import * as dotenv from 'dotenv'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, update, remove, onValue, orderByChild, get } from "firebase/database";

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

export const addMessage = (messageId, userId, name, messageText) => {

  userExists(userId, name)
  set(ref(db, `messages/${messageId}`), {
    user: userId,
    name: name,
    message: messageText,
  })
  .then(() => console.log('message written'))
  .catch((error) => console.log(error));
}

// add reactions to existing messages
export const addReactions = (messageId, reactions) => {
  reactions.map((reaction) => {
    set(ref(db, `messages/${messageId}/reactions/${reaction.name}`), {
      count: reaction.count,
      users: reaction.users,
    })
    .then(() => console.log('reactions added'))
    .catch((error) => console.log(error));
  })
 
}

const userExists = (userId, name) => {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      set(ref(db, `users/${userId}`), {
        name: name,
      })
      .then(() => console.log('message written'))
      .catch((error) => console.log(error));
    }
  }).catch((error) => {
    console.error(error);
  });

}
