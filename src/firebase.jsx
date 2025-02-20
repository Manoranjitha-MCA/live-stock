// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyRYrAsdbO7ioq4rwSx2bbnjIfNi821dM",
  authDomain: "live-stock-7936c.firebaseapp.com",
  projectId: "live-stock-7936c",
  databaseURL: "https://live-stock-7936c-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "live-stock-7936c.firebasestorage.app",
  messagingSenderId: "117480669873",
  appId: "1:117480669873:web:9e1fd69b572bb935e15890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {app,db}