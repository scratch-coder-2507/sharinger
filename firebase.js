import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC5ZfaTcjvJXqdfl7MomXzkvp3JrHX4g_k",
    authDomain: "sharinger-73c59.firebaseapp.com",
    projectId: "sharinger-73c59",
    storageBucket: "sharinger-73c59.appspot.com",
    messagingSenderId: "831736845415",
    appId: "1:831736845415:web:fd5b35e45e9d968e33b0c2"
  };

const app = !firebase.apps.length 
? firebase.initializeApp(firebaseConfig)
: firebase.app(); 

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider };