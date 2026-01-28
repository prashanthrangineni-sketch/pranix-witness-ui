'use client'

import { useEffect, useState } from 'react'

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/merchant/orders')
      .then(res => res.json())
      .then(json => {
        setOrders(json.orders || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setLoading(false)
      })
  }, [])

  const updateStatus = async (order_id: string, status: string) => {
    await fetch('/api/order/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id, status })
    })
    location.reload()
  }

  if (loading) return <div style={styles.center}>⏳ Loading orders...</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🏪 Merchant Command Center</h1>

      {orders.length === 0 && (
        <div style={styles.empty}>No orders yet</div>
      )}

      {orders.map(order => (
        <div key={order.order_id} style={styles.card}>
          <h3>{order.product_title || order.product_name}</h3>
          <p>Order: {order.order_id}</p>
          <p>₹{order.total_amount || order.price}</p>
          <p>Status: <strong>{order.status}</strong></p>

          <div style={styles.actions}>
            {order.status === 'PENDING' && (
              <button onClick={() => updateStatus(order.order_id, 'CONFIRMED')}>
                Accept
              </button>
            )}

            {order.status === 'CONFIRMED' && (
              <button onClick={() => updateStatus(order.order_id, 'PREPARING')}>
                Preparing
              </button>
            )}

            {order.status === 'PREPARING' && (
              <button onClick={() => updateStatus(order.order_id, 'READY_FOR_PICKUP')}>
                Ready
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles: any = {
  page: { padding: 16, maxWidth: 900, margin: '0 auto' },
  heading: { fontSize: 28, marginBottom: 12 },
  center: { padding: 40, textAlign: 'center' },
  empty: { padding: 20, textAlign: 'center', color: '#666' },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    background: '#fff',
    boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
  },
  actions: { marginTop: 10, display: 'flex', gap: 10 }
}
