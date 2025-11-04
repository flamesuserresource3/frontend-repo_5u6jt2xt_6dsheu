import { useEffect, useState } from 'react';
import IdeaCard from './IdeaCard.jsx';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export default function IdeaList({ range = 'all', sort = 'votes' }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ range, sort });
      const res = await fetch(`${BASE_URL}/ideas?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load ideas');
      const data = await res.json();
      setIdeas(data || []);
    } catch (err) {
      setError(err.message || 'Error loading ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, sort]);

  if (loading) {
    return (
      <div className="grid gap-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
    );
  }

  if (!ideas.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">No ideas yet. Be the first to post!</div>
    );
  }

  return (
    <div className="grid gap-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} onChanged={fetchIdeas} />
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
    </div>
  );
}
