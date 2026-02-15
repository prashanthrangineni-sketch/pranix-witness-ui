'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', sector: 'grocery', icon: '🍔', bg: '#fff7ed' },
  { label: 'Grocery', sector: 'grocery', icon: '🛒', bg: '#ecfeff' },
  { label: 'Pharmacy', sector: 'pharmacy', icon: '💊', bg: '#f0fdf4' },
  { label: 'Electronics', sector: 'electronics', icon: '📱', bg: '#f5f3ff' },
  { label: 'Fashion', sector: 'apparel_fashion', icon: '👕', bg: '#fff1f2' },
  { label: 'Home Services', sector: 'home_services', icon: '🛠️', bg: '#fffbeb' },
]

export default function SectorGrid() {
  const router = useRouter()

  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Explore categories
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {SECTORS.map(s => (
          <div
            key={s.sector}
            onClick={() =>
              router.push(`/search/results?sector=${s.sector}`)
            }
            style={{
              backgroundColor: s.bg,
              borderRadius: 18,
              padding: '20px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
