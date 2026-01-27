'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SECTORS = [
  { id: 'food', name: '🍔 Food' },
  { id: 'grocery', name: '🛒 Grocery' },
  { id: 'mobility', name: '🚗 Mobility' },
  { id: 'electronics', name: '📱 Electronics' },
  { id: 'pharmacy', name: '💊 Pharmacy' },
  { id: 'apparel', name: '👕 Apparel' },
  { id: 'home_services', name: '🏠 Home Services' }
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('grocery')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, sector })
      })

      const data = await res.json()

      console.log('API Response:', data)

      if (data?.snapshot?.snapshot_id) {
        router.push(`/results/${data.snapshot.snapshot_id}`)
      } else {
        alert('Snapshot not created — API returned invalid response.')
      }
    } catch (err) {
      console.error(err)
      alert('Search failed. API not reachable.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-4">Cart2Save</h1>
        <p className="text-center text-gray-500 mb-6">
          Best price. Every time.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              className={`p-2 rounded-lg ${
                sector === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product..."
            className="flex-1 p-3 border rounded-xl"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 rounded-xl"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  )
}
