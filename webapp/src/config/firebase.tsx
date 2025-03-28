// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, Firestore} from "firebase/firestore";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "foodieroute-46028.firebaseapp.com",
  projectId: "foodieroute-46028",
  storageBucket: "foodieroute-46028.firebasestorage.app",
  messagingSenderId: "126786799246",
  appId: "1:126786799246:web:2805c09e0d0a137e29abdf",
  measurementId: "G-XVFTYG0FR4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const  auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

export const db: Firestore = getFirestore()