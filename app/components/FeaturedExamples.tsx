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
        marginBottom: '32px',
      }}
    >
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '14px',
        }}
      >
        Example comparisons
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {EXAMPLES.map((e) => (
          <div
            key={e.label}
            onClick={() =>
              router.push(`/search?q=${encodeURIComponent(e.query)}`)
            }
            style={{
              minWidth: '150px',
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>
              {e.label}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              {e.sector}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
