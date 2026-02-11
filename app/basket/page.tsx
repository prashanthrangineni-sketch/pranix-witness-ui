'use client'

import { useEffect, useState } from 'react'

type BasketItem = {
  product_id: string
  quantity: number
  price_at_add: number
  product_name?: string
  product_image?: string
}

type MerchantGroup = {
  merchant_id: string
  merchant_name?: string
  sector?: string
  items: BasketItem[]
  subtotal: number
}

export default function BasketPage() {
  const [merchants, setMerchants] = useState<MerchantGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBasket() {
      const sessionId = localStorage.getItem('cart2save_session')

      if (!sessionId) {
        alert('No active session found')
        setLoading(false)
        return
      }

      const res = await fetch('/api/basket/view', {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      const data = await res.json()
      setMerchants(data.merchants || [])
      setLoading(false)
    }

    loadBasket()
  }, [])

  if (loading) {
    return <div style={{ padding: 20 }}>Loading basket…</div>
  }

  if (merchants.length === 0) {
    return <div style={{ padding: 20 }}>Basket is empty</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>My Basket</h1>

      {merchants.map((merchant) => (
        <div
          key={merchant.merchant_id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 10,
            padding: 16,
            marginBottom: 20
          }}
        >
          {/* Merchant Header */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>
              {merchant.merchant_name || merchant.merchant_id}
            </h3>
            <small style={{ color: '#666' }}>
              {merchant.sector || 'General'}
            </small>
          </div>

          {/* Items */}
          {merchant.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: '1px solid #eee'
              }}
            >
              {/* Image Placeholder */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: '#f2f2f2',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  fontSize: 12,
                  color: '#999'
                }}
              >
                IMG
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>
                  {item.product_name || item.product_id}
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>
                  Qty: {item.quantity}
                </div>
              </div>

              {/* Price */}
              <div style={{ fontWeight: 600 }}>
                ₹{item.price_at_add}
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div
            style={{
              textAlign: 'right',
              fontWeight: 700,
              marginTop: 8
            }}
          >
            Total: ₹{merchant.subtotal}
          </div>
        </div>
      ))}
    </div>
  )
}
