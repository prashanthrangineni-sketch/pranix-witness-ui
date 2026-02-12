'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', query: 'food' },
  { label: 'Grocery', query: 'grocery' },
  { label: 'Pharmacy', query: 'pharmacy' },
  { label: 'Electronics', query: 'electronics' },
  { label: 'Fashion', query: 'fashion' },
  { label: 'Home Services', query: 'home services' },
  { label: 'Mobility', query: 'mobility' },
]

export default function SectorGrid() {
  const router = useRouter()

  return (
    <section
      style={{
        maxWidth: '720px',
        margin: '16px auto',
        padding: '0 16px',
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        Explore categories
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {SECTORS.map((s) => (
          <div
            key={s.label}
            onClick={() =>
              router.push(`/search?q=${encodeURIComponent(s.query)}`)
            }
            style={{
              padding: '14px 10px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </div>
        ))}
      </div>
    </section>
  )
}
