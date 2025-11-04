import { useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function CommentsSection({ ideaId }) {
  const [comments, setComments] = useState(null);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${BASE}/ideas/${ideaId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, [ideaId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author || undefined, content })
      });
      const data = await res.json();
      setComments(prev => [data, ...(prev || [])]);
      setContent('');
    } catch (e) {
      console.error(e);
      alert('Failed to comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Name (optional)"
          className="sm:w-40 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black disabled:opacity-60"
        >{loading ? 'Posting...' : 'Comment'}</button>
      </form>

      {!comments ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-500">No comments yet.</div>
      ) : (
        <ul className="space-y-3">
          {comments.map(c => (
            <li key={c.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
                {(c.author || 'A').slice(0,1).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">{c.author || 'Anonymous'}</span>
                  {c.created_at && <span className="text-gray-400 ml-2">{new Date(c.created_at).toLocaleString()}</span>}
                </div>
                <div className="text-sm text-gray-700">{c.content}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
