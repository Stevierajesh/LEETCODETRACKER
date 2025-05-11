export async function getAcceptedProblemTitles(username) {
    const apiURL = `https://lctracker.stevierajesh.com/api/${username}`;
    
    try {
        const res = await fetch(apiURL);
        const data = await res.json();

        const acceptedTitles = new Set();

        data.recentSubmissions.forEach(problem => {
            if (problem.statusDisplay === "Accepted") {
                acceptedTitles.add(problem.title);
            }
        });

        return Array.from(acceptedTitles);
    } catch (err) {
        console.error("Failed to fetch or process LeetCode data:", err);
        return [];
    }
}

export async function getAcceptedProblemsWithPoints(username) {
    const apiURL = `https://lctracker.stevierajesh.com/api/${username}`;
    const difficultyMap = {
        Easy: 1,
        Medium: 2,
        Hard: 3
    };

    try {
        const res = await fetch(apiURL);
        const data = await res.json();

        const acceptedProblems = [];
        const seenTitles = new Set();

        data.recentSubmissions.forEach(problem => {
            if (problem.statusDisplay === "Accepted" && !seenTitles.has(problem.title)) {
                seenTitles.add(problem.title);

                // fallback to Medium difficulty
                const points = difficultyMap[problem.difficulty] || 2;

                acceptedProblems.push({
                    title: problem.title,
                    points
                });
            }
        });

        return acceptedProblems;
    } catch (err) {
        console.error("Failed to fetch or process LeetCode data:", err);
        return [];
    }
}
export async function doesLeetCodeUserExist(username) {
    try {
      const res = await fetch(`https://lctracker.stevierajesh.com/api/${username}`);
      const data = await res.json();
  
      // If the response contains an 'errors' array and the key 'matchedUser' is missing/null
      if (data.errors || data.totalSolved === undefined) {
        return false;
      }
  
      return true;
    } catch (err) {
      console.error("Error checking LeetCode user:", err);
      return false;
    }
  }

  export async function getNewAcceptedProblemsWithPoints(username, existingTitles) {
    const apiURL = `https://lctracker.stevierajesh.com/api/${username}`;
    const difficultyMap = {
      Easy: 1,
      Medium: 2,
      Hard: 3
    };
  
    try {
      const res = await fetch(apiURL);
      const data = await res.json();
  
      const newProblems = [];
      const seen = new Set(existingTitles);
  
      // Check if LeetCode returned valid data
      if (!data.recentSubmissions || !Array.isArray(data.recentSubmissions)) {
        console.warn("LeetCode returned unexpected structure.");
        return [];
      }
  
      for (const problem of data.recentSubmissions) {
        const title = problem.title;
  
        if (
          problem.statusDisplay === "Accepted" &&
          !seen.has(title)
        ) {
          const difficulty = problem.difficulty || "Medium"; // fallback
          const points = difficultyMap[difficulty] || 1;
  
          newProblems.push({
            title,
            points,
            link: `https://leetcode.com/problems/${problem.titleSlug}`
          });
  
          seen.add(title); // prevent repeats in this session
        }
      }
  
      return newProblems;
    } catch (err) {
      console.error("Failed to fetch or compare LeetCode problems:", err);
      return [];
    }
  }
  