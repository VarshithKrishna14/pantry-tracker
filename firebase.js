// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_tqzk8d5GfffLQbt-3CSazdQs9-uQjFow7Q",
  authDomain: "inventory-management-1dcd1.firebaseapp.com",
  projectId: "inventory-management-1dcd1",
  storageBucket: "inventory-management-1dcd1.appspot.com",
  messagingSenderId: "160496768972",
  appId: "1:160496768972:web:2a5bfec1e1ed9dd5c0af69",
  measurementId: "G-J0S5Y87J4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}