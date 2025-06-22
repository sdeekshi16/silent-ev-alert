// src/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAkRfB48SiPNmLF7fR2lFGnz7v_7BpeWNM",
  authDomain: "silentev-alert.firebaseapp.com",
  databaseURL: "https://silentev-alert-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Add this line
  projectId: "silentev-alert",
  storageBucket: "silentev-alert.appspot.com",
  messagingSenderId: "704777238562",
  appId: "1:704777238562:web:d4b46340f4bf2603e4727b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
