export async function fetchLeetCodeStats(username) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          submissionCalendar
        }
        recentSubmissionList(username: $username) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;
  
    const response = await fetch("https://c67315d9-mute-sky-caa9.stevieisrajesh.workers.dev/?url=https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com"
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });
  
    const data = await response.json();
  
    if (data.errors) throw new Error("LeetCode user not found.");
    return {
      solvedProblems: data.data.matchedUser.submitStats.acSubmissionNum,
      recent: data.data.recentSubmissionList
    };
  }
