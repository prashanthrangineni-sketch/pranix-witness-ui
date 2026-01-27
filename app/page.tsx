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
    if (!query.trim()) {
      alert('Enter product name')
      return
    }

    alert(`Searching "${query}" in sector "${sector}"`)

    setLoading(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, sector })
      })

      const data = await res.json()
      console.log('API RESPONSE:', data)

      const snapshotId =
        data?.snapshot?.snapshot_id ||
        data?.snapshot?.id ||
        data?.snapshot?.[0]?.snapshot_id

      if (!snapshotId) {
        alert('Snapshot not created — API returned invalid response.')
        return
      }

      router.push(`/results/${snapshotId}`)
    } catch (err) {
      console.error(err)
      alert('Search failed. API connectivity issue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>

        <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>
          Cart2Save
        </h1>

        <p style={{ textAlign: 'center', color: '#666', marginBottom: 12 }}>
          Best price. Every time.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginBottom: 16
        }}>
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: '2px solid',
                borderColor: sector === s.id ? '#16a34a' : '#ddd',
                background: sector === s.id ? '#16a34a' : '#f3f4f6',
                color: sector === s.id ? 'white' : '#333',
                fontWeight: 'bold',
                fontSize: 13,
                cursor: 'pointer',
                transform: sector === s.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product..."
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #ccc',
              fontSize: 15
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#4f46e5',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              minWidth: 90
            }}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

      </div>
    </div>
  )
      }
