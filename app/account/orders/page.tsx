'use client'

import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const router = useRouter()

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
        My Orders
      </h1>

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>

        <h3 style={{ fontSize: 18, marginBottom: 6 }}>
          No orders yet
        </h3>

        <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
          Search products and start saving instantly
        </p>

        <button
          onClick={() => router.push('/search')}
          style={{
            padding: '12px 20px',
            borderRadius: 10,
            background: '#000',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Go to Search
        </button>
      </div>
    </div>
  )
}
