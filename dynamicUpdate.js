import { db, auth } from './firebaseinit.js';  // Import initialized instances
import { ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getNewAcceptedProblemsWithPoints } from './leetCodeEngine.js';



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
//const app = initializeApp(firebaseConfig);
//const db = getDatabase(app);
//const analytics = getAnalytics(app);


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("User not authenticated. Aborting dynamic update.");
    return;
  }

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

        await set(ref(db, `${userRefPath}/problems/${problemKey}`), {
          title: problem.title,
          points: problem.points,
          link: problem.link
        });

        await set(ref(db, `clusters/${clusterCode}/RecentProblems/${problemKey}`), {
          Owner: username,
          ProblemName: problem.title,
          ProblemPoints: problem.points
        });

        await set(ref(db, `${userRefPath}/Allproblems/${problem.title}`), true);

        newPoints += problem.points;
      }

      const problemsSnapshot = await get(child(usersRef, `${username}/problems`));
      const problemCount = problemsSnapshot.exists()
        ? Object.keys(problemsSnapshot.val()).length
        : 0;

      await set(ref(db, `${userRefPath}/NumOfProblems`), problemCount);

      if (newPoints > 0) {
        const pointsSnapshot = await get(child(usersRef, `${username}/Points`));
        const existingPoints = pointsSnapshot.exists() ? parseInt(pointsSnapshot.val()) || 0 : 0;

        await set(ref(db, `${userRefPath}/Points`), existingPoints + newPoints);
      }
    }
  } catch (err) {
    console.error("Error updating cluster users:", err);
  }
});
