import { useMemo } from 'react';

export default function Header({ range, setRange, sort, setSort }) {
  const ranges = useMemo(() => [
    { key: 'all', label: 'All time' },
    { key: 'month', label: 'This month' },
    { key: 'week', label: 'This week' },
  ], []);

  const sorts = useMemo(() => [
    { key: 'votes', label: 'Highest votes' },
    { key: 'comments', label: 'Highest comments' },
  ], []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ideas to build for VibeCoders</h1>
        <p className="text-sm text-gray-500">Post / upvote ideas you would like to exist in real</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg bg-gray-100 p-1">
          {ranges.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${range === r.key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >{r.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <label className="text-sm text-gray-500">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm rounded-md border-gray-200 bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sorts.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
