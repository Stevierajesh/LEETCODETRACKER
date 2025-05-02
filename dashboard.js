import { db } from './firebaseinit.js'; // import initialized database
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { auth } from './firebaseinit.js'; // import initialized auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

//const app = initializeApp(firebaseConfig);
//const db = getDatabase(app);
//const auth = getAuth();

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

      const sortedUsers = Object.entries(users)
  .map(([username, data]) => ({
    username,
    problems: data.NumOfProblems ?? 0,
    points: data.Points ?? 0
  }))
  .sort((a, b) => b.points - a.points); // sort by points descending

sortedUsers.forEach(user => {
  const card = document.createElement("div");
  card.className = "user-card";
  card.innerHTML = `
    <span class="username">${user.username}</span>
    <span>${user.problems} Problem(s)</span>
    <span>${user.points} Point(s)</span>
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