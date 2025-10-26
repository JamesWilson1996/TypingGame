const API_URL = "http://127.0.0.1:8000/api";

export async function submitScore(name, wpm, accuracy) {
  const res = await fetch(`${API_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, wpm, accuracy }),
  });
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${API_URL}/leaderboard`);
  return res.json();
}
