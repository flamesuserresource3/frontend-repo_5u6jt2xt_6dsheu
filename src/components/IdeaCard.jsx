import { useEffect, useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export default function IdeaCard({ idea, onChanged }) {
  const [localIdea, setLocalIdea] = useState(idea);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => setLocalIdea(idea), [idea]);

  const upvote = async () => {
    try {
      // optimistic update
      setLocalIdea((prev) => ({ ...prev, votes: (prev.votes || 0) + 1 }));
      const res = await fetch(`${BASE_URL}/ideas/${localIdea.id}/upvote`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to upvote');
      const updated = await res.json();
      setLocalIdea(updated);
      onChanged?.();
    } catch (e) {
      // revert on error
      setLocalIdea(idea);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ideas/${localIdea.id}/comments`);
      if (!res.ok) throw new Error('Failed to load comments');
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      setComments([]);
    }
  };

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next) await loadComments();
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      setPosting(true);
      const res = await fetch(`${BASE_URL}/ideas/${localIdea.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment.trim() }),
      });
      if (!res.ok) throw new Error('Failed to comment');
      setComment('');
      await loadComments();
      onChanged?.();
    } catch (e) {
      // ignore for now
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <button
          onClick={upvote}
          className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 hover:bg-slate-100"
          title="Upvote"
        >
          <ThumbsUp size={18} />
          <span className="text-xs font-semibold mt-1">{localIdea.votes ?? 0}</span>
        </button>

        <div className="flex-1">
          <h3 className="text-lg font-medium leading-tight">{localIdea.title}</h3>
          {localIdea.description ? (
            <p className="mt-1 text-sm text-slate-600">{localIdea.description}</p>
          ) : null}

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>
                {localIdea.comments_count ?? 0} comment{(localIdea.comments_count ?? 0) === 1 ? '' : 's'}
              </span>
            </div>
            <button onClick={toggleComments} className="inline-flex items-center gap-1 hover:text-slate-700">
              <MessageSquare size={14} />
              {showComments ? 'Hide comments' : 'Show comments'}
            </button>
          </div>

          {showComments && (
            <div className="mt-4">
              <form onSubmit={submitComment} className="mb-3 flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={posting}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {posting ? 'Posting…' : 'Comment'}
                </button>
              </form>

              <div className="space-y-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500">No comments yet. Be the first!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm text-slate-700">{c.content}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
