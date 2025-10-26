// Use env override if provided (for containerized/prod), otherwise default to a relative path
const API_URL = import.meta?.env?.VITE_API_URL || "/api";

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
