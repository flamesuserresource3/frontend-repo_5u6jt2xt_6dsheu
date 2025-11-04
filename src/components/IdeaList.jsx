import { useEffect, useState, useCallback } from 'react';
import IdeaCard from './IdeaCard';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function IdeaList({ range, sort }) {
  const [ideas, setIdeas] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/ideas?range=${range}&sort=${sort}`);
      const data = await res.json();
      setIdeas(data);
    } catch (e) {
      console.error(e);
    }
  }, [range, sort]);

  useEffect(() => { load(); }, [load]);

  const handleUpvoted = (updated) => {
    setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  if (!ideas) return (
    <div className="grid gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (ideas.length === 0) return (
    <div className="text-center text-gray-500 py-10">No ideas yet. Be the first to post!</div>
  );

  return (
    <div className="grid gap-3 sm:gap-4">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} onUpvoted={handleUpvoted} />
      ))}
    </div>
  );
}
