'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
  sector?: string
}

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initAndLoad() {
      // Init basket session
      const initRes = await fetch('/api/basket/init', { method: 'POST' })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      // Load products
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=id,product_name,price,merchant_id,sector`,
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
    if (!sessionId) return alert('No session found')

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
    return <div style={{ padding: 24, fontSize: 16 }}>Loading products…</div>
  }

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Search Results
      </h1>

      {products.map((product) => {
        const isGrocery = product.sector === 'grocery'

        return (
          <div
            key={product.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e5e5e5',
              padding: 16,
              marginBottom: 14,
              borderRadius: 12,
              background: '#fff'
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {product.product_name}
              </div>
              <div style={{ marginTop: 6, color: '#444' }}>
                ₹{product.price}
              </div>
              {product.sector && (
                <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                  {product.sector}
                </div>
              )}
            </div>

            {isGrocery ? (
              <button
                onClick={() => addToBasket(product)}
                style={{
                  padding: '10px 14px',
                  background: '#0a0a0a',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                Add to Basket
              </button>
            ) : (
              <button
                style={{
                  padding: '10px 14px',
                  background: '#f3f3f3',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                View & Buy
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
