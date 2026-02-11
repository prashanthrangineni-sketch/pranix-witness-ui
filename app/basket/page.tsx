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
  const [sessionReady, setSessionReady] = useState(false)

  // Step 1: Wait until session is actually available
  useEffect(() => {
    const checkSession = () => {
      const sid = localStorage.getItem('cart2save_session')
      if (sid) {
        setSessionReady(true)
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 200)

    return () => clearInterval(interval)
  }, [])

  // Step 2: Load basket ONLY after session is ready
  useEffect(() => {
    if (!sessionReady) return

    async function loadBasket() {
      const sessionId = localStorage.getItem('cart2save_session')
      if (!sessionId) return

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
  }, [sessionReady])

  if (!sessionReady || loading) {
    return <div style={{ padding: 20 }}>Loading basket…</div>
  }

  if (merchants.length === 0) {
    return <div style={{ padding: 20 }}>Basket is empty</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Basket</h1>

      {merchants.map((merchant) => (
        <div
          key={merchant.merchant_id}
          style={{
            border: '1px solid #ccc',
            padding: 16,
            marginBottom: 16,
            borderRadius: 8
          }}
        >
          <h3>Merchant: {merchant.merchant_id}</h3>

          <ul>
            {merchant.items.map((item, index) => (
              <li key={index}>
                Product: {item.product_id} — Qty: {item.quantity} — ₹{item.price_at_add}
              </li>
            ))}
          </ul>

          <strong>Total: ₹{merchant.subtotal}</strong>
        </div>
      ))}
    </div>
  )
}
