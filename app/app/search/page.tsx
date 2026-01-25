'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const SECTORS = [
  { id: 'food', name: '🍔 Food' },
  { id: 'grocery', name: '🛒 Groceries' },
  { id: 'mobility', name: '🚗 Transport' },
  { id: 'electronics', name: '📱 Electronics' },
  { id: 'pharmacy', name: '💊 Pharmacy' },
  { id: 'apparel', name: '👕 Fashion' },
  { id: 'home_services', name: '🏠 Home Services' }
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('food')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const location = { lat: 12.9716, lng: 77.5946 }

    const { data, error } =
      await supabase.functions.invoke('search-products', {
        body: {
          query,
          sector,
          user_id: null,
          location
        }
      })

    if (!error) router.push(`/results/${data.snapshot_id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 p-4">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full">

        <h1 className="text-3xl font-bold text-center mb-6">Cart2Save</h1>

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

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product..."
            className="flex-1 p-3 border rounded-xl"
          />
          <button className="bg-indigo-600 text-white px-4 rounded-xl">
            Search
          </button>
        </form>

      </div>
    </div>
  )
}
