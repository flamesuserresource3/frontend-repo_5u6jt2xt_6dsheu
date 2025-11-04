import { Rocket, Filter, SortAsc, SortDesc } from 'lucide-react';

export default function Header({ filters, onChange }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Rocket size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">VibeCoders Hunt</h1>
          <p className="text-sm text-slate-500">Share ideas. Upvote your favorites. Join the conversation.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Filter size={16} className="text-slate-500" />
          <select
            value={filters.range}
            onChange={(e) => onChange({ ...filters, range: e.target.value })}
            className="bg-transparent text-sm outline-none"
          >
            <option value="all">All time</option>
            <option value="month">This month</option>
            <option value="week">This week</option>
          </select>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          {filters.sort === 'votes' ? (
            <SortAsc size={16} className="text-slate-500" />
          ) : (
            <SortDesc size={16} className="text-slate-500" />
          )}
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="bg-transparent text-sm outline-none"
          >
            <option value="votes">Top by votes</option>
            <option value="comments">Top by comments</option>
          </select>
        </div>
      </div>
    </header>
  );
}
