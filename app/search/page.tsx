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

      // 2. Load demo products from Supabase (public table)
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
    return <div style={{ padding: 20 }}>Loading products…</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Search Results</h1>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 12,
            borderRadius: 8
          }}
        >
          <h3>{product.product_name}</h3>
          <p>₹{product.price}</p>

          <button
            onClick={() => addToBasket(product)}
            style={{
              padding: '8px 12px',
              background: '#000',
              color: '#fff',
              borderRadius: 6
            }}
          >
            Add to Basket
          </button>
        </div>
      ))}
    </div>
  )
}
