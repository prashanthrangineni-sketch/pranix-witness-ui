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
  const [activeChip, setActiveChip] = useState<string | null>(null)

  function goToResults(value: string) {
    if (!value.trim()) return
    router.push(`/search/results?q=${encodeURIComponent(value)}`)
  }

  return (
    <div style={{ padding: '16px', maxWidth: '720px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
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
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveChip(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              goToResults(query)
            }
          }}
          placeholder="Search products, brands, services…"
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            fontSize: '15px',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '18px',
        }}
      >
        {CHIPS.map((chip) => {
          const active = chip === activeChip
          return (
            <div
              key={chip}
              onClick={() => {
                setActiveChip(chip)
                setQuery(chip)
                goToResults(chip)
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: active
                  ? '1px solid #111827'
                  : '1px solid #e5e7eb',
                backgroundColor: active ? '#111827' : '#ffffff',
                color: active ? '#ffffff' : '#111827',
              }}
            >
              {chip}
            </div>
          )
        })}
      </div>

      <div style={{ color: '#6b7280', fontSize: '14px' }}>
        Type a search and press Enter, or choose a category
      </div>
    </div>
  )
}
