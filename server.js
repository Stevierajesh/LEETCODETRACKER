// server.js

// Firebase core setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// import { getAuth, signInWithPopup, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// import { getAdditionalUserInfo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYUEYIp-ru7WFWm9Ji1V2OEYxNoaMrooA",
  authDomain: "leetcode-e1299.firebaseapp.com",
  projectId: "leetcode-e1299",
  storageBucket: "leetcode-e1299.firebasestorage.app",
  messagingSenderId: "117262107016",
  appId: "1:117262107016:web:1f0c093f354392bfa67a3d",
  measurementId: "G-W9K8Z0GWL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

//Find Cluster Code
document.querySelector('.form-wrapper').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const clusterCode = document.getElementById('leetcodeUsername').value.trim();
    if (!clusterCode) return;
  
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `clusters/${clusterCode}`));
      if (snapshot.exists()) {
        localStorage.setItem('clusterCode', clusterCode);

        const username = localStorage.getItem('leetcodeUsername');
        if (!username) {
            alert("Username missing. Please go back and enter your LeetCode username.");
        return;
        }

        const userRef = child(dbRef, `clusters/${clusterCode}/Users/${username}`);
        await set(userRef, {
            NumOfProblems: 0,
            Points: 0
        });

        window.location.href = 'dashboard.html';
      } else {
        alert("Cluster not found. Please check the code.");
      }
    } catch (error) {
      console.error("Error checking cluster:", error);
      alert("Something went wrong. Try again later.");
    }
  });