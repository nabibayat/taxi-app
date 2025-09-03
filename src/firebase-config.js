import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCWFvCXBA9PK6nhYdWusHuDWaVI1dskYJ0",
    authDomain: "react-firebase-app-bb497.firebaseapp.com",
    projectId: "react-firebase-app-bb497",
    storageBucket: "react-firebase-app-bb497.firebasestorage.app",
    messagingSenderId: "685769646652",
    appId: "1:685769646652:web:a1d0b673d3430236ccd939",
    measurementId: "G-SV46HZ9XVK"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, auth, storage };