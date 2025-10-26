import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setScores);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-center text-[#11463E]">Leaderboard</h2>
      <table className="table-auto mx-auto border border-[#11463E]">
        <thead>
          <tr>
            <th className="border border-[#11463E] px-4 py-2 text-[#11463E]">Name</th>
            <th className="border border-[#11463E] px-4 py-2 text-[#11463E]">WPM</th>
            <th className="border border-[#11463E] px-4 py-2 text-[#11463E]">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td className="border border-[#11463E] px-4 py-2">{s.name}</td>
              <td className="border border-[#11463E] px-4 py-2">{s.wpm}</td>
              <td className="border border-[#11463E] px-4 py-2">{s.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
