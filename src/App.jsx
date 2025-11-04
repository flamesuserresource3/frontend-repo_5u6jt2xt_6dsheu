import { useEffect, useState } from 'react';
import Header from './components/Header';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';

export default function App() {
  const [range, setRange] = useState('all');
  const [sort, setSort] = useState('votes');
  const [triggerReload, setTriggerReload] = useState(0);

  useEffect(() => { document.title = 'VibeCoders Ideas'; }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <Header range={range} setRange={setRange} sort={sort} setSort={setSort} />
        <div className="mt-6">
          <IdeaForm onCreated={() => setTriggerReload(v => v + 1)} />
        </div>
        <div className="mt-6">
          {/* key forces reload when posting or filter/sort changes */}
          <IdeaList key={`${range}-${sort}-${triggerReload}`} range={range} sort={sort} />
        </div>
      </div>
    </div>
  );
}
