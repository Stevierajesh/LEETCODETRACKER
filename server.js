// server.js

// Firebase core setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getAcceptedProblemTitles } from './leetCodeEngine.js';
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
const auth = getAuth();
//Find Cluster Code
document.querySelector(".form-wrapper").addEventListener("submit", (evt) => {
  evt.preventDefault();

  const clusterCode = document
    .getElementById("leetcodeUsername")
    .value.trim();
  if (!clusterCode) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Not signed in");
      return;
    }

    console.log("[DEBUG] Auth OK:", user.email);

    try {
      // ─────── 1. does cluster exist? ───────
      console.log("[DEBUG] get clusters/" + clusterCode);
      const clusterSnap = await get(
        child(ref(db), `clusters/${clusterCode}`)
      );

      if (!clusterSnap.exists()) {
        alert("Cluster not found");
        return;
      }

      console.log("[DEBUG] cluster exists");

      // ─────── 2. prepare user payload ───────
      const username = localStorage.getItem("leetcodeUsername");
      if (!username) {
        alert("Missing LeetCode username (localStorage)");
        return;
      }

      const accepted = await getAcceptedProblemTitles(username);
      const allProblems = {};
      accepted.forEach((t) => (allProblems[t] = true));

      // ─────── 3. write user under cluster ───────
      const userPath = `clusters/${clusterCode}/Users/${username}`;
      console.log("[DEBUG] set " + userPath);

      await set(ref(db, userPath), {
        NumOfProblems: 0,
        Points: 0,
        Email: user.email, // use Auth email
        problems: {},
        Allproblems: allProblems,
      });

      console.log("[DEBUG] user node written");

      // ─────── 4. write account summary ───────


      const accountRef = ref(db, `Accounts/${user.uid}`);
      const snapshot = await get(accountRef);

      if (snapshot.exists()) {
        // User already exists — only update clusters, don't overwrite
        const updates = {};
        updates[`clusters/${clusterCode}`] = true;
        await update(accountRef, updates);
        console.log("Cluster added to existing account.");
      } else {
        console.log("[DEBUG] set Accounts/" + user.uid);
        await set(ref(db, `Accounts/${user.uid}`), {
          email: user.email,
          leetcodeUsername: username,
          clusters: { [clusterCode]: true },
        });
      }


      console.log("[DEBUG] account node written");
      window.location.href = "dashboard.html";
    } catch (err) {
      // every permission error will end up here with path info printed above
      console.error("[DEBUG] Firebase op failed", err);
      alert("Firebase permission error – see console");
    }
  });
});
