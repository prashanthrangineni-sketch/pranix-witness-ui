'use client'

import { useEffect, useState } from 'react'

/* -----------------------------
   TEMP DISPLAY MAPS (UI ONLY)
   ----------------------------- */

const PRODUCT_MAP: Record<string, string> = {
  'c391076b-ba29-465b-9d77-0ba04bd90653': 'Aashirvaad Atta 5kg'
}

const MERCHANT_MAP: Record<string, string> = {
  '660e8400-e29b-41d4-a716-446655440001': 'Sakshi Kirana Store'
}

/* ----------------------------- */

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

      if (!sessionId) {
        alert('No active session found')
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
      <h1>My Basket</h1>

      {merchants.map((merchant) => (
        <div
          key={merchant.merchant_id}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 16,
            borderRadius: 8
          }}
        >
          <h3>
            Merchant:{' '}
            {MERCHANT_MAP[merchant.merchant_id] || merchant.merchant_id}
          </h3>

          <ul>
            {merchant.items.map((item, index) => (
              <li key={index}>
                {PRODUCT_MAP[item.product_id] || item.product_id} — Qty:{' '}
                {item.quantity} — ₹{item.price_at_add}
              </li>
            ))}
          </ul>

          <strong>Total: ₹{merchant.subtotal}</strong>
        </div>
      ))}
    </div>
  )
}
