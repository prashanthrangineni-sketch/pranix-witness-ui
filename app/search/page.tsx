'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const chips = ['Milk', 'Rice', 'Mobile', 'Shoes', 'Tablet']

  return (
    <div style={{ padding: '16px', maxWidth: '720px', margin: '0 auto' }}>
      
      {/* 🔙 BACK + SEARCH */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, services..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '15px',
          }}
        />
      </div>

      {/* QUICK CHIPS */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '16px',
        }}
      >
        {chips.map((c) => (
          <div
            key={c}
            onClick={() => {
              setQuery(c)
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* RESULTS PLACEHOLDER */}
      <div style={{ color: '#6b7280', fontSize: '14px' }}>
        Start typing to see results
      </div>
    </div>
  )
}
