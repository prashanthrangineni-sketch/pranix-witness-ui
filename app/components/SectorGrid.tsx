'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', icon: '🍔', query: 'food' },
  { label: 'Grocery', icon: '🛒', query: 'grocery' },
  { label: 'Pharmacy', icon: '💊', query: 'pharmacy' },
  { label: 'Electronics', icon: '📱', query: 'electronics' },
  { label: 'Fashion', icon: '👕', query: 'fashion' },
  { label: 'Home Services', icon: '🛠️', query: 'home services' },
  { label: 'Mobility', icon: '🚕', query: 'mobility' },
]

export default function SectorGrid() {
  const router = useRouter()

  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
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
              router.push(`/search/results?q=${encodeURIComponent(s.query)}`)
            }
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: '26px' }}>{s.icon}</div>
            <div style={{ fontWeight: 600, marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
