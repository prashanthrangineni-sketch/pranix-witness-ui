'use client';

import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const params = useSearchParams();
  const query = params.get('q');
  const sector = params.get('s');

  const dummyResults = [
    { merchant: 'Local Store', price: 219 },
    { merchant: 'Platform A', price: 229 },
    { merchant: 'Platform B', price: 245 },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h2 className="text-xl font-bold mb-4">
        Results for "{query}" ({sector})
      </h2>

      <div className="space-y-3">
        {dummyResults.map((r, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{r.merchant}</div>
              <div className="text-sm text-gray-500">Delivery: 30–45 min</div>
            </div>
            <div className="font-bold text-lg">₹{r.price}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Snapshot Engine: ACTIVE • Trust Layer: READY
      </div>
    </main>
  );
}
