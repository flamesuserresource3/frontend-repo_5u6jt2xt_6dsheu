import { useState } from 'react';
import Header from './components/Header.jsx';
import IdeaForm from './components/IdeaForm.jsx';
import IdeaList from './components/IdeaList.jsx';

export default function App() {
  const [filters, setFilters] = useState({ range: 'all', sort: 'votes' });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    // Trigger list refresh after a new idea is created
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header filters={filters} onChange={setFilters} />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 order-2 md:order-1">
            <IdeaList key={refreshKey} range={filters.range} sort={filters.sort} />
          </div>
          <div className="md:col-span-1 order-1 md:order-2">
            <IdeaForm onCreated={handleCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}
