'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', sector: 'food', icon: '🍔' },
  { label: 'Grocery', sector: 'grocery', icon: '🛒' },
  { label: 'Pharmacy', sector: 'pharmacy', icon: '💊' },
  { label: 'Electronics', sector: 'electronics', icon: '📱' },
  { label: 'Apparel & Fashion', sector: 'apparel_fashion', icon: '👕' },
  { label: 'Beauty & Wellness', sector: 'beauty_wellness', icon: '💆' },
  { label: 'Home Services', sector: 'home_services', icon: '🛠️' },
  { label: 'Mobility', sector: 'mobility', icon: '🚕' },
]

export default function SectorGrid() {
  const router = useRouter()

  return (
    <section>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Explore categories
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {SECTORS.map(s => (
          <div
            key={s.sector}
            onClick={() =>
              router.push(`/search/results?sector=${s.sector}`)
            }
            style={{
              padding: 16,
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#fff',
            }}
          >
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
