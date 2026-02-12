'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
}

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initAndLoad() {
      // 1. Initialize basket session
      const initRes = await fetch('/api/basket/init', {
        method: 'POST'
      })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      // 2. Load products
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
      alert('Session not found')
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
    return (
      <div style={{ padding: 24, fontSize: 16 }}>
        Loading products…
      </div>
    )
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 16
        }}
      >
        Search Results
      </h1>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            display: 'flex',
            gap: 16,
            padding: 16,
            marginBottom: 14,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          {/* Image placeholder */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              background:
                'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#6b7280'
            }}
          >
            Image
          </div>

          {/* Product details */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 6,
                lineHeight: 1.3
              }}
            >
              {product.product_name}
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 10
              }}
            >
              ₹{product.price}
            </div>

            <button
              onClick={() => addToBasket(product)}
              style={{
                padding: '8px 14px',
                background: '#111827',
                color: '#ffffff',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Add to Basket
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
