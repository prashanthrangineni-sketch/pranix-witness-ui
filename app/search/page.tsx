'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  return (
    <div style={{ padding: '16px' }}>
      {/* 🔙 BACK TO HOME */}
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
            fontSize: '18px',
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
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
          }}
        />
      </div>

      {/* 🔍 SEARCH RESULTS PLACEHOLDER */}
      <div style={{ color: '#6b7280', fontSize: '14px' }}>
        Start typing to see results
      </div>
    </div>
  )
}
