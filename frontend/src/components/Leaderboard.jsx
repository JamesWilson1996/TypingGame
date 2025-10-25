import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setScores);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Leaderboard</h2>
      <table className="table-auto mx-auto border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">WPM</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.wpm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}