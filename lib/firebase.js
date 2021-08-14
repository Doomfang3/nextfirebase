import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuT6H0bhD4hGaBadwpwm8acKlgUb0ngkI",
  authDomain: "nextfirebasefireship.firebaseapp.com",
  projectId: "nextfirebasefireship",
  storageBucket: "nextfirebasefireship.appspot.com",
  messagingSenderId: "213259777039",
  appId: "1:213259777039:web:72ac385062f07d0f9ddf7a",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
