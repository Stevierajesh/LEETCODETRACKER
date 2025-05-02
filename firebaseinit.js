import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYUEYIp-ru7WFWm9Ji1V2OEYxNoaMrooA",
  authDomain: "leetcode-e1299.firebaseapp.com",
  projectId: "leetcode-e1299",
  storageBucket: "leetcode-e1299.appspot.com",
  messagingSenderId: "117262107016",
  appId: "1:117262107016:web:1f0c093f354392bfa67a3d",
  measurementId: "G-W9K8Z0GWL8"
};

// 🛠 Initialize or retrieve the app instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔁 Services shared by the whole app
const db = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
