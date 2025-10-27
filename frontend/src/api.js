// Use env override if provided (for containerized/prod), otherwise default to a relative path
const API_URL = import.meta?.env?.VITE_API_URL || "/api";

export async function submitScore(name, wpm, accuracy) {
  const res = await fetch(`${API_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, wpm, accuracy }),
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && data.detail) msg = Array.isArray(data.detail) ? data.detail.map(d => d.msg).join(", ") : data.detail;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${API_URL}/leaderboard`);
  return res.json();
}

export async function fetchResults(page = 1, limit = 20, sort = 'latest', order = 'desc') {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset), sort, order });
  const res = await fetch(`${API_URL}/results?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch results (${res.status})`);
  return res.json();
}
