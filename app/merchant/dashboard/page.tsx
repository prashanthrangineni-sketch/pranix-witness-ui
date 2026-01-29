'use client'

import { useEffect, useState } from 'react'

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/merchant/orders')
      const json = await res.json()
      setOrders(json.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(order: any, status: string) {
    setWorking(order.id)

    try {
      const res = await fetch('/api/merchant/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          status,
          merchant_id: order.merchant_id
        })
      })

      const json = await res.json()

      if (!res.ok) {
        alert(json?.error || 'Status update failed')
      } else {
        fetchOrders()
      }
    } catch (err) {
      console.error('Update failed', err)
      alert('Update failed')
    } finally {
      setWorking(null)
    }
  }

  if (loading) {
    return <div style={styles.center}>Loading orders...</div>
  }

  if (!orders.length) {
    return <div style={styles.center}>No orders yet</div>
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🏪 Merchant Command Center</h1>

      {orders.map(order => (
        <div key={order.id} style={styles.card}>
          <div style={styles.row}>
            <strong>Order:</strong> {order.order_id}
          </div>

          <div style={styles.row}>
            <strong>Product:</strong> {order.product_title}
          </div>

          <div style={styles.row}>
            <strong>Price:</strong> ₹{order.price}
          </div>

          <div style={styles.row}>
            <strong>Status:</strong> {order.status}
          </div>

          <div style={styles.actions}>
            <button
              disabled={working === order.id}
              onClick={() => updateStatus(order, 'PREPARING')}
            >
              {working === order.id ? '...' : 'Accept'}
            </button>

            <button
              disabled={working === order.id}
              onClick={() => updateStatus(order, 'READY_FOR_PICKUP')}
            >
              {working === order.id ? '...' : 'Ready'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

const styles: any = {
  page: {
    maxWidth: 700,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'system-ui, sans-serif'
  },
  center: {
    padding: 60,
    textAlign: 'center',
    fontSize: 18
  },
  heading: {
    fontSize: 26,
    marginBottom: 20
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    background: '#ffffff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
  },
  row: {
    marginBottom: 6
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 10
  }
}
