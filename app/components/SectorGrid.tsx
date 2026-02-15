'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', icon: '🍔', query: 'food', bg: '#fff7ed' },
  { label: 'Grocery', icon: '🛒', query: 'grocery', bg: '#ecfeff' },
  { label: 'Pharmacy', icon: '💊', query: 'pharmacy', bg: '#f0fdf4' },
  { label: 'Electronics', icon: '📱', query: 'electronics', bg: '#f5f3ff' },
  { label: 'Fashion', icon: '👕', query: 'fashion', bg: '#fff1f2' },
  { label: 'Home Services', icon: '🛠️', query: 'home services', bg: '#fffbeb' },
  { label: 'Mobility', icon: '🚕', query: 'mobility', bg: '#eef2ff' },
]

export default function SectorGrid() {
  const router = useRouter()

  return (
    <section style={{ marginBottom: '36px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '16px',
        }}
      >
        Explore categories
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}
      >
        {SECTORS.map((s) => (
          <div
            key={s.label}
            onClick={() =>
              router.push(
                `/search/results?q=${encodeURIComponent(s.query)}`
              )
            }
            style={{
              backgroundColor: s.bg,
              borderRadius: '18px',
              padding: '20px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'transform 0.1s ease',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>
              {s.icon}
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
