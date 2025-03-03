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
  apiKey: "AIzaSyAxbI8q_Z_aljgR5hQgWyMdUvz32MHb5VY",
  authDomain: "foodieroute.firebaseapp.com",
  projectId: "foodieroute",
  storageBucket: "foodieroute.firebasestorage.app",
  messagingSenderId: "727835182381",
  appId: "1:727835182381:web:ac8128fb9322921a56bfa4",
  measurementId: "G-HRHTEPQQX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const  auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

export const db: Firestore = getFirestore()