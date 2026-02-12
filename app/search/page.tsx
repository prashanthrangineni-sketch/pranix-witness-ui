'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
  image_url_1?: string
  sector?: string
}

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [basketCount, setBasketCount] = useState(0)
  const [basketTotal, setBasketTotal] = useState(0)
  const [activeSector, setActiveSector] = useState<string>('all')

  useEffect(() => {
    async function initAndLoad() {
      // Init basket
      const initRes = await fetch('/api/basket/init', { method: 'POST' })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      // Load products
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=id,product_name,price,merchant_id,image_url_1,sector`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          }
        }
      )

      const data = await res.json()
      setProducts(data)
      setFiltered(data)
      setLoading(false)
    }

    initAndLoad()
  }, [])

  function filterBySector(sector: string) {
    setActiveSector(sector)
    if (sector === 'all') {
      setFiltered(products)
    } else {
      setFiltered(products.filter(p => p.sector === sector))
    }
  }

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

    setBasketCount(c => c + 1)
    setBasketTotal(t => t + product.price)
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading products…</div>
  }

  return (
    <div style={{ padding: 16, paddingBottom: 110, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
        Search
      </h1>

      {/* Category Chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' }}>
        {['all', 'grocery', 'food', 'electronics', 'pharmacy'].map(s => (
          <button
            key={s}
            onClick={() => filterBySector(s)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: activeSector === s ? '#111' : '#fff',
              color: activeSector === s ? '#fff' : '#111',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{
              border: '1px solid #eee',
              borderRadius: 14,
              padding: 14,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <img
              src={product.image_url_1 || 'https://via.placeholder.com/300x200?text=Product'}
              alt={product.product_name}
              style={{
                width: '100%',
                height: 160,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: 10
              }}
            />

            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
              {product.product_name}
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
              ₹{product.price}
            </div>

            <button
              onClick={() => addToBasket(product)}
              style={{
                width: '100%',
                padding: '10px 0',
                background: '#111',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Basket Bar */}
      {basketCount > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#111',
            color: '#fff',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{basketCount} items</div>
            <div style={{ fontSize: 14 }}>₹{basketTotal}</div>
          </div>

          <a
            href="/basket"
            style={{
              background: '#fff',
              color: '#111',
              padding: '10px 18px',
              borderRadius: 10,
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            View Basket →
          </a>
        </div>
      )}
    </div>
  )
}
