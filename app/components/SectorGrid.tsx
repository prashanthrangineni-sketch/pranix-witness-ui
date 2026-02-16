'use client'

import { useRouter } from 'next/navigation'

const SECTORS = [
  { label: 'Food', icon: '🍔', value: 'food' },
  { label: 'Grocery', icon: '🛒', value: 'grocery' },
  { label: 'Pharmacy', icon: '💊', value: 'pharmacy' },
  { label: 'Electronics', icon: '📱', value: 'electronics' },
  { label: 'Apparel & Fashion', icon: '👕', value: 'apparel_fashion' },
  { label: 'Beauty & Wellness', icon: '💄', value: 'beauty_wellness' },
  { label: 'Home Services', icon: '🛠️', value: 'home_services' },
  { label: 'Mobility', icon: '🚕', value: 'mobility' },
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
            key={s.value}
            onClick={() => router.push(`/search/results?sector=${s.value}`)}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 18,
              padding: 20,
              textAlign: 'center',
              cursor: 'pointer',
              background: '#fff',
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
