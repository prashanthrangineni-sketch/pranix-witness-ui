'use client'

import { useEffect, useState } from 'react'

type Order = {
  order_id: string
  product_title: string
  price: number
  status: string
  snapshot_id: string
  created_at: string
}

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    const res = await fetch('/api/merchant/orders')
    const json = await res.json()
    setOrders(json.orders || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (order_id: string, status: string) => {
    await fetch('/api/merchant/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id, status })
    })
    fetchOrders()
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🏪 Merchant Command Center</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No incoming orders.</p>
      ) : (
        <div style={styles.list}>
          {orders.map(order => (
            <div key={order.order_id} style={styles.card}>
              <div>
                <h3>{order.product_title}</h3>
                <p>Order: {order.order_id}</p>
                <p>₹{order.price}</p>
                <p>Status: <b>{order.status}</b></p>
              </div>

              <div style={styles.actions}>
                {order.status === 'PENDING' && (
                  <>
                    <button
                      style={styles.confirm}
                      onClick={() => updateStatus(order.order_id, 'CONFIRMED')}
                    >
                      Accept
                    </button>
                    <button
                      style={styles.reject}
                      onClick={() => updateStatus(order.order_id, 'CANCELLED')}
                    >
                      Reject
                    </button>
                  </>
                )}

                {order.status === 'CONFIRMED' && (
                  <button
                    style={styles.prepare}
                    onClick={() => updateStatus(order.order_id, 'PREPARING')}
                  >
                    Start Preparing
                  </button>
                )}

                {order.status === 'PREPARING' && (
                  <button
                    style={styles.ready}
                    onClick={() => updateStatus(order.order_id, 'READY_FOR_PICKUP')}
                  >
                    Ready for Pickup
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles: any = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'system-ui, sans-serif'
  },
  heading: {
    fontSize: 28,
    marginBottom: 20
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 14,
    background: '#fff'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  confirm: {
    background: '#16a34a',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none'
  },
  reject: {
    background: '#dc2626',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none'
  },
  prepare: {
    background: '#2563eb',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none'
  },
  ready: {
    background: '#7c3aed',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none'
  }
}
