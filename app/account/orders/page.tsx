'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  product_name: string
  amount: number
  created_at: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?select=*`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
          }
        )

        const data = await res.json()
        setOrders(data || [])
      } catch {
        setOrders([])
      }
    }

    loadOrders()
  }, [])

  if (orders.length === 0) {
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

          <h3>No orders yet</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            Orders will appear automatically once purchases are completed
          </p>

          <button
            onClick={() => router.push('/search')}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              background: '#000',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            Go to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 14,
            marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {order.product_name}
          </div>
          <div style={{ fontSize: 14, color: '#555' }}>
            ₹{order.amount}
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
