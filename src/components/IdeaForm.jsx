import { useState } from 'react';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function IdeaForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || undefined })
      });
      const data = await res.json();
      setTitle('');
      setDescription('');
      onCreated?.(data);
    } catch (e) {
      console.error(e);
      alert('Failed to post idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Post a new idea</h2>
        <span className="text-xs text-gray-400">Be concise and friendly</span>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Your brilliant idea in a sentence"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a few details (optional)"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >{loading ? 'Posting...' : 'Post idea'}</button>
      </div>
    </form>
  );
}
