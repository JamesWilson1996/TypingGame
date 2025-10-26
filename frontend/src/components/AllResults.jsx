import { useEffect, useState } from "react";
import { fetchResults } from "../api";

export default function AllResults({ onBack }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState('latest');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (p, s = sort, o = order) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResults(p, limit, s, o);
      setRows(data.results || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, sort, order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, order]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#11463E]">All Results</h2>
        <button
          onClick={onBack}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-[#11463E] text-white hover:brightness-95"
        >
          Back
        </button>
      </div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="text-sm text-gray-700">Sort by:</div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => { setPage(1); setSort(e.target.value); }}
            className="border rounded px-2 py-1"
          >
            <option value="latest">Latest</option>
            <option value="wpm">WPM</option>
            <option value="accuracy">Accuracy</option>
            <option value="name">Name</option>
          </select>
          <select
            value={order}
            onChange={(e) => { setPage(1); setOrder(e.target.value); }}
            className="border rounded px-2 py-1"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
      {error && (
        <div className="text-red-600 mb-3">Error: {error}</div>
      )}
      <div className="overflow-auto border border-[#11463E]/30 rounded">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-[#11463E]/30 px-3 py-2 text-left">#</th>
              <th className="border border-[#11463E]/30 px-3 py-2 text-left">Name</th>
              <th className="border border-[#11463E]/30 px-3 py-2 text-left">WPM</th>
              <th className="border border-[#11463E]/30 px-3 py-2 text-left">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3" colSpan={4}>Loading…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3" colSpan={4}>No results yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="border border-[#11463E]/30 px-3 py-2">{r.id}</td>
                  <td className="border border-[#11463E]/30 px-3 py-2">{r.name}</td>
                  <td className="border border-[#11463E]/30 px-3 py-2">{r.wpm}</td>
                  <td className="border border-[#11463E]/30 px-3 py-2">{r.accuracy}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} ({total} total)
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev || loading}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
