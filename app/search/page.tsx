'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SECTORS = [
  { id: 'food', label: '🍔 Food' },
  { id: 'grocery', label: '🛒 Groceries' },
  { id: 'electronics', label: '📱 Electronics' },
  { id: 'pharmacy', label: '💊 Pharmacy' },
  { id: 'apparel', label: '👕 Fashion' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('food');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/results?s=${sector}&q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Search Best Price</h1>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              className={`p-2 rounded-lg text-sm ${
                sector === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product..."
            className="flex-1 p-3 border rounded-xl"
          />
          <button className="bg-indigo-600 text-white px-4 rounded-xl">
            Go
          </button>
        </form>
      </div>
    </main>
  );
}
