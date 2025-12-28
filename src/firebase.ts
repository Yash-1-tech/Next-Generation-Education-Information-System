// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlYiXtrBr80pOqzeOGUwjdfUG4sMZ5zkg",
  authDomain: "neis-98f39.firebaseapp.com",
  projectId: "neis-98f39",
  storageBucket: "neis-98f39.firebasestorage.app",
  messagingSenderId: "229255698902",
  appId: "1:229255698902:web:1771073a38fc0308ab6c77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);