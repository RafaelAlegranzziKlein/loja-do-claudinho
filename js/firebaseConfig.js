// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVxw5ZRVYJu6pjzA--NEJUufQtefVaNK0",
  authDomain: "bancoclaudio-fa419.firebaseapp.com",
  databaseURL: "https://bancoclaudio-fa419-default-rtdb.firebaseio.com",
  projectId: "bancoclaudio-fa419",
  storageBucket: "bancoclaudio-fa419.firebasestorage.app",
  messagingSenderId: "150465420368",
  appId: "1:150465420368:web:e8a5cd657f61274aae8555",
  measurementId: "G-9GH977QWTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };