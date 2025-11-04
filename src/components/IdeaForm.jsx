import { useState } from 'react';
import { Rocket } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export default function IdeaForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create idea');
      }
      setTitle('');
      setDescription('');
      onCreated?.();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Rocket size={18} className="text-indigo-600" />
          <h2 className="font-medium">Share a new idea</h2>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Idea title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description (optional)"
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Posting…' : 'Post idea'}
          </button>
        </form>
      </div>
    </div>
  );
}
