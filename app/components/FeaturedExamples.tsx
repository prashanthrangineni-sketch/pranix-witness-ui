'use client'

import { useRouter } from 'next/navigation'

const EXAMPLES = [
  { label: 'Milk', query: 'milk', sector: 'Grocery' },
  { label: 'iPhone', query: 'iphone', sector: 'Electronics' },
  { label: 'Paracetamol', query: 'paracetamol', sector: 'Pharmacy' },
]

export default function FeaturedExamples() {
  const router = useRouter()

  return (
    <section
      style={{
        maxWidth: '720px',
        margin: '24px auto',
        padding: '0 16px',
      }}
    >
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        Example comparisons
      </h3>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
        {EXAMPLES.map((e) => (
          <div
            key={e.label}
            onClick={() =>
              router.push(`/search?q=${encodeURIComponent(e.query)}`)
            }
            style={{
              minWidth: '140px',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 600 }}>{e.label}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {e.sector}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
