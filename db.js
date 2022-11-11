import * as dotenv from 'dotenv'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, update, remove, onValue, orderByChild, get } from "firebase/database";

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
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
export const addReactions  = (messageId, userId, name, reactions) => {
  return new Promise((resolve, reject) => {
    userExists(userId, name)

    reactions.map((reaction) => {
      set(ref(db, `messages/${messageId}/reactions/${reaction.name}`), {
        count: reaction.count,
        users: reaction.users,
      })
      .then(() => {
      })
      .catch((error) => console.log(error));
    })
  })
}

const userExists = (userId, name) => {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      // the user exists
      console.log(snapshot.val());
      console.log('user already exists!')
    } else {
      set(ref(db, `users/${userId}`), {
        name: name,
        score: 0,
      })
      .then(() => console.log('message written'))
      .catch((error) => console.log(error));
    }
  }).catch((error) => {
    console.error(error);
  });
}

export const updateScore = (userId, amount) => {
  const dbRef = ref(getDatabase());

  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    let currentScore = snapshot.val().score
    update(ref(db, `users/${userId}`), {
      'score' : currentScore + amount
    })
  
  })
}

export const getScore = async (userId) => {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    let score = snapshot.val().score;
    console.log(score);
    return score;
  })
}