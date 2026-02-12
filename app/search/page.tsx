'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
}

const SECTORS = [
  'Grocery',
  'Electronics',
  'Fashion',
  'Food',
  'Travel',
  'Services',
  'Insurance'
]

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSector, setActiveSector] = useState<string>('Grocery')

  useEffect(() => {
    async function initAndLoad() {
      // 1. Initialize basket session
      const initRes = await fetch('/api/basket/init', { method: 'POST' })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      // 2. Load products (demo feed)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=id,product_name,price,merchant_id`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          }
        }
      )

      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }

    initAndLoad()
  }, [])

  async function addToBasket(product: Product) {
    const sessionId = localStorage.getItem('cart2save_session')
    if (!sessionId) {
      alert('No active session')
      return
    }

    await fetch('/api/basket/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify({
        product_uuid: product.id,
        quantity: 1
      })
    })

    alert('Added to basket')
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading products…</div>
  }

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* ASK BAR */}
      <div
        style={{
          padding: 16,
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10,
          borderBottom: '1px solid #eee'
        }}
      >
        <input
          placeholder="Search products, services, or ask anything…"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 10,
            border: '1px solid #ddd',
            fontSize: 16
          }}
        />
      </div>

      {/* SECTOR STRIP */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 12,
          padding: '12px 16px'
        }}
      >
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid #ddd',
              background: sector === activeSector ? '#000' : '#fff',
              color: sector === activeSector ? '#fff' : '#000',
              fontSize: 14,
              whiteSpace: 'nowrap'
            }}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      <div style={{ padding: '0 16px' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: 16,
              marginBottom: 14,
              background: '#fff'
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {product.product_name}
            </div>

            <div style={{ marginTop: 6, fontSize: 15 }}>
              ₹{product.price}
            </div>

            <button
              onClick={() => addToBasket(product)}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '10px 0',
                borderRadius: 8,
                border: 'none',
                background: '#000',
                color: '#fff',
                fontSize: 15
              }}
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>

      {/* STICKY BOTTOM BAR */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #eee',
          padding: 14
        }}
      >
        <a
          href="/basket"
          style={{
            display: 'block',
            textAlign: 'center',
            background: '#000',
            color: '#fff',
            padding: '12px 0',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 16
          }}
        >
          View Basket
        </a>
      </div>
    </div>
  )
}
