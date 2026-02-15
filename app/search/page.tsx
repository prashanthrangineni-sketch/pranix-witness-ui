'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CHIPS = [
  'Food',
  'Grocery',
  'Pharmacy',
  'Electronics',
  'Fashion',
  'Mobility',
  'Home services',
]

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function goToResults(value: string) {
    if (!value.trim()) return
    router.push(`/search/results?q=${encodeURIComponent(value)}`)
  }

  return (
    <div style={{ padding: '16px', maxWidth: '720px', margin: '0 auto' }}>
      {/* SEARCH BAR */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') goToResults(query)
        }}
        placeholder="Search products, brands, services…"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          fontSize: '15px',
        }}
      />

      {/* CATEGORY CHIPS */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto' }}>
        {CHIPS.map((chip) => (
          <div
            key={chip}
            onClick={() => goToResults(chip)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: '#fff',
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  )
}
