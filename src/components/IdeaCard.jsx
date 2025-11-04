import { useState, useMemo } from 'react';
import { Rocket, Lightbulb, Sparkles, Star, Heart, Zap, Flame, MessageSquare, ThumbsUp } from 'lucide-react';
import CommentsSection from './CommentsSection';

const icons = [Rocket, Lightbulb, Sparkles, Star, Heart, Zap, Flame];

function pickIcon(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return icons[hash % icons.length];
}

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function IdeaCard({ idea, onUpvoted }) {
  const [open, setOpen] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const Icon = useMemo(() => pickIcon(idea.id || idea._id || ''), [idea.id]);

  const upvote = async () => {
    if (upvoting) return;
    setUpvoting(true);
    try {
      const res = await fetch(`${BASE}/ideas/${idea.id}/upvote`, { method: 'POST' });
      const data = await res.json();
      onUpvoted?.(data);
    } catch (e) {
      console.error(e);
    } finally {
      setUpvoting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-lg bg-indigo-50 p-3"><Icon className="h-6 w-6 text-indigo-600" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-medium leading-6 break-words">{idea.title}</h3>
              {idea.description && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{idea.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={upvote} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm hover:bg-gray-50">
                <ThumbsUp className="h-4 w-4" />
                <span>{idea.votes ?? 0}</span>
              </button>
              <button onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm hover:bg-gray-50">
                <MessageSquare className="h-4 w-4" />
                <span>{idea.comments_count ?? 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="pt-4 mt-4 border-t border-gray-100">
          <CommentsSection ideaId={idea.id} />
        </div>
      )}
    </div>
  );
}
