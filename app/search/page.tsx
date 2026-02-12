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

      // Save session for later pages
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
      alert('No session found')
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
    <div
      style={{
        padding: '16px',
        paddingBottom: '90px',
        maxWidth: 900,
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 16
        }}
      >
        Search Results
      </h1>

      {/* Product Cards */}
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #e5e5e5',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 6
              }}
            >
              {product.product_name}
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 700
              }}
            >
              ₹{product.price}
            </div>
          </div>

          <button
            onClick={() => addToBasket(product)}
            style={{
              padding: '10px 14px',
              background: '#111',
              color: '#fff',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      ))}

      {/* Sticky Basket Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#111',
          color: '#fff',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.25)',
          zIndex: 1000
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          Basket ready
        </div>

        <a
          href="/basket"
          style={{
            background: '#fff',
            color: '#111',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          View Basket →
        </a>
      </div>
    </div>
  )
}
