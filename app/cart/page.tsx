'use client'

import { useEffect, useState } from 'react'

export default function CartPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/basket/view', {
      headers: {
        'X-Session-ID': 'd20bb6db-787b-4730-b393-991b7b8ffc25'
      }
    })
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading cart...</p>

  return (
    <div style={{ padding: 16 }}>
      <h2>My Cart</h2>

      {data.merchants.map((merchant: any) => (
        <div
          key={merchant.merchant_id}
          style={{
            border: '1px solid #ccc',
            padding: 12,
            marginBottom: 16
          }}
        >
          <h3>Merchant</h3>

          {merchant.items.map((item: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div>Product ID: {item.product_id}</div>
              <div>Qty: {item.quantity}</div>
              <div>Price: ₹{item.price_at_add}</div>
            </div>
          ))}

          <strong>Subtotal: ₹{merchant.subtotal}</strong>
        </div>
      ))}
    </div>
  )
}
