
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getNewAcceptedProblemsWithPoints } from './leetCodeEngine.js';
const clusterCode = localStorage.getItem("clusterCode");
if (clusterCode) {
  document.querySelector(".clust").innerHTML = `CLUSTERNAME - #${clusterCode}`;
}


const firebaseConfig = {
  apiKey: "AIzaSyCYUEYIp-ru7WFWm9Ji1V2OEYxNoaMrooA",
  authDomain: "leetcode-e1299.firebaseapp.com",
  databaseURL: "https://leetcode-e1299-default-rtdb.firebaseio.com",
  projectId: "leetcode-e1299",
  storageBucket: "leetcode-e1299.appspot.com",
  messagingSenderId: "117262107016",
  appId: "1:117262107016:web:1f0c093f354392bfa67a3d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const leaderboardDiv = document.querySelector('.leaderboard');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const usersRef = ref(db, `clusters/${clusterCode}/Users`);
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();

      Object.keys(users).forEach(username => {
        const userData = users[username];
        const problems = userData.NumOfProblems ?? 0;
        const points = userData.Points ?? 0;

        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = `
          <span class="username">${username}</span>
          <span>${problems} Problems</span>
          <span>${points} Points</span>
        `;
        leaderboardDiv.appendChild(card);
      });
    } else {
      leaderboardDiv.innerHTML = "<p>No users found in this cluster.</p>";
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    leaderboardDiv.innerHTML = "<p>Failed to load leaderboard.</p>";
  }
});


const recentProblemsDiv = document.querySelector('.recentProblems');
const recentRef = ref(db, `clusters/${clusterCode}/RecentProblems`);

try {
const recentSnapshot = await get(recentRef);
if (recentSnapshot.exists()) {
  const problems = recentSnapshot.val();

  // Clear placeholder
  recentProblemsDiv.innerHTML = '';

  Object.keys(problems).forEach(key => {
    const problem = problems[key];
    const name = problem.ProblemName ?? "Unknown";
    const points = problem.ProblemPoints ?? 0;

    const card = document.createElement("div");
    card.className = "recentProblemCard";
    card.innerHTML = `
      <span class="problemName">${name}</span>
      <span class="problemPoints">${points} pts</span>
    `;
    recentProblemsDiv.appendChild(card);
  });
} else {
  recentProblemsDiv.innerHTML = "<p>No recent problems found.</p>";
}
} catch (error) {
console.error("Error fetching recent problems:", error);
recentProblemsDiv.innerHTML = "<p>Failed to load recent problems.</p>";
}

window.onload = async function () {
    const clusterCode = localStorage.getItem("clusterCode");
    if (!clusterCode) return;
  
    const usersRef = ref(db, `clusters/${clusterCode}/Users`);
  
    try {
      const snapshot = await get(usersRef);
      if (!snapshot.exists()) return;
  
      const usersData = snapshot.val();
  
      for (const username in usersData) {
        if (username.toLowerCase() === "test" || username.toLowerCase() === "admin") continue;
  
        const userRefPath = `clusters/${clusterCode}/Users/${username}`;
        const allProblemsSnapshot = await get(child(usersRef, `${username}/Allproblems`));
        const existingTitles = allProblemsSnapshot.exists()
          ? Object.keys(allProblemsSnapshot.val())
          : [];
  
        const newProblems = await getNewAcceptedProblemsWithPoints(username, existingTitles);
  
        let newPoints = 0;
  
        for (const problem of newProblems) {
          const problemKey = problem.title.replace(/\./g, "_");
  
          // Add to user's problems
          await set(ref(db, `${userRefPath}/problems/${problemKey}`), {
            title: problem.title,
            points: problem.points,
            link: problem.link
          });
  
          // Add to RecentProblems (cluster level)
          await set(ref(db, `clusters/${clusterCode}/RecentProblems/${problemKey}`), {
            Owner: username,
            ProblemName: problem.title,
            ProblemPoints: problem.points
          });
  
          // Mark in Allproblems
          await set(ref(db, `${userRefPath}/Allproblems/${problem.title}`), true);
  
          // Tally points
          newPoints += problem.points;
        }
  
        if (newPoints > 0) {
          // Fetch existing points
          const pointsSnapshot = await get(child(usersRef, `${username}/Points`));
          const existingPoints = pointsSnapshot.exists() ? parseInt(pointsSnapshot.val()) || 0 : 0;
  
          // Update total points
          await set(ref(db, `${userRefPath}/Points`), existingPoints + newPoints);
        }
      }
    } catch (err) {
      console.error("Error updating cluster users:", err);
    }
  };
  