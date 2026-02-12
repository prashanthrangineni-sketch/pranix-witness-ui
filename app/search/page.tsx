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
  const [activeSector, setActiveSector] = useState<string>('all')

  useEffect(() => {
    async function initAndLoad() {
      // Initialize basket session
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
    if (!sessionId) return

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

  const filteredProducts =
    activeSector === 'all'
      ? products
      : products.filter((p) => p.sector === activeSector)

  if (loading) {
    return <div style={{ padding: 24, fontSize: 18 }}>Loading products…</div>
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* HEADER */}
      <div style={{ padding: '20px 16px 12px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Search
        </h1>

        {/* SECTOR TABS */}
        <div style={{ display: 'flex', gap: 10 }}>
          {['all', 'grocery', 'electronics', 'pharmacy'].map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid #ddd',
                background:
                  activeSector === sector ? '#000' : '#fff',
                color: activeSector === sector ? '#fff' : '#000',
                fontWeight: 600
              }}
            >
              {sector === 'all'
                ? 'ALL'
                : sector.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ padding: '0 16px' }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {product.product_name}
            </div>

            <div
              style={{
                fontSize: 14,
                color: '#666',
                marginTop: 4
              }}
            >
              {product.sector}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                ₹{product.price}
              </div>

              <button
                onClick={() => addToBasket(product)}
                style={{
                  padding: '10px 18px',
                  background: '#000',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 700,
                  border: 'none'
                }}
              >
                Add to Basket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
