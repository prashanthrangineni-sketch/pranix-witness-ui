'use client'

import { useEffect, useState } from 'react'

type BasketItem = {
  product_id: string
  quantity: number
  price_at_add: number
}

type MerchantGroup = {
  merchant_id: string
  items: BasketItem[]
  subtotal: number
}

export default function BasketPage() {
  const [merchants, setMerchants] = useState<MerchantGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBasket() {
      const sessionId = localStorage.getItem('cart2save_session')
      if (!sessionId) return

      const res = await fetch('/api/basket/view', {
        headers: { 'X-Session-ID': sessionId }
      })

      const data = await res.json()
      setMerchants(data.merchants || [])
      setLoading(false)
    }

    loadBasket()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading basket…</div>
  if (merchants.length === 0)
    return <div style={{ padding: 24 }}>Your basket is empty</div>

  return (
    <div style={{ padding: 16, paddingBottom: 120, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
        My Basket
      </h1>

      {merchants.map(merchant => (
        <div
          key={merchant.merchant_id}
          style={{
            border: '1px solid #eee',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            background: '#fff'
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>
            Merchant
          </h3>

          {merchant.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px dashed #ddd'
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Product</div>
                <div style={{ fontSize: 14 }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: 700 }}>
                ₹{item.price_at_add}
              </div>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 14,
              fontWeight: 800
            }}
          >
            <span>Subtotal</span>
            <span>₹{merchant.subtotal}</span>
          </div>
        </div>
      ))}

      {/* Sticky checkout bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#111',
          color: '#fff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <strong>Proceed to Merchant</strong>
        <button
          style={{
            background: '#fff',
            color: '#111',
            padding: '10px 18px',
            borderRadius: 10,
            fontWeight: 800,
            border: 'none'
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
