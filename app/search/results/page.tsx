'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const MOCK_RESULTS = [
  {
    id: 'p1',
    title: 'Milk 500ml',
    priceRange: '₹48 – ₹55',
    options: [
      { label: 'Amazon', type: 'affiliate' },
      { label: 'Flipkart', type: 'affiliate' },
      { label: 'Local store', type: 'ondc' },
    ],
  },
  {
    id: 'p2',
    title: 'iPhone 15',
    priceRange: '₹72,000 – ₹79,000',
    options: [
      { label: 'Amazon', type: 'affiliate' },
      { label: 'Flipkart', type: 'affiliate' },
    ],
  },
  {
    id: 'p3',
    title: 'Paracetamol 650mg',
    priceRange: '₹28 – ₹35',
    options: [
      { label: 'Amazon', type: 'affiliate' },
      { label: 'Local pharmacy', type: 'ondc' },
    ],
  },
]

export default function SearchResultsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const query = params.get('q') || ''

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => router.push('/search')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
          Results for “{query || 'search'}”
        </h1>
      </div>

      {/* RESULTS */}
      {MOCK_RESULTS.map((item) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            background: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {item.title}
          </div>

          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 12 }}>
            {item.priceRange}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {item.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => alert(`Redirect to ${opt.label}`)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Buy on {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* DISCLAIMER */}
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 24 }}>
        Prices shown are snapshots. You’ll complete your purchase on the seller’s site.
      </div>
    </main>
  )
}
