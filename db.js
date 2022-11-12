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
  userExists(userId, name);
  set(ref(db, `messages/${messageId}`), {
    user: userId,
    name: name,
    message: messageText,
  })
  .then(() => console.log('message written'))
  .catch((error) => console.log(error));
}

export const addImage = (fileId, imageUrl, userId, name) => {
  userExists(userId, name);
  set(ref(db, `images/${fileId}`), {
    imageUrl: imageUrl,
    user: userId,
    name: name,
  })
  .then(() => console.log('image saved'))
  .catch((error => console.log(error)));
}

// add reactions to existing messages
// TODO refactor this to be async await?
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


//TODO put the adduser function into here to make code look less nasty
const userExists = (userId, name) => {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      // the user exists
      // console.log(snapshot.val());
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
  let score = 0;
  await get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    score = snapshot.val().score;
  }).catch((error) => {
    console.log("User has not yet posted anything!");
  });
  //TODO Christian, do you know how to look for specific errors or something?
  // Right now, I am just assuming the error is that the user has not been added yet
  // I would add the user, but then we need to pass the name to this function too which seems unnecessary
  return score;
}