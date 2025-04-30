// src.js

// Firebase core setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getAuth, signInWithPopup, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getAdditionalUserInfo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
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
const analytics = getAnalytics(app);

// Initialize Auth
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Handle redirect result after returning from Google Sign-In
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {    // ✅ Corrected this line
      const user = result.user;
      console.log("Signed in as:", user.displayName);
      window.location.href = "index.html";   // ✅ Redirect after sign-in
    }
  })
  .catch((error) => {
    console.error(error);
    // Handle Errors if needed
  });

// Function to trigger sign-in on button click
export function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const info = getAdditionalUserInfo(result);
      if (info.isNewUser) {
        window.location.href = "newuser.html";   // redirect new users
      } else {
        window.location.href = "dashboard.html";      // redirect returning users
      }
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert("Failed to sign in with Google.");
    });
  }

document.getElementById('googleSignInBtn').addEventListener('click', () => {
    console.log('Google Sign-In button clicked!');
    signInWithGoogle();
});