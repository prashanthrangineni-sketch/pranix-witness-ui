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
  'Pharmacy',
  'Travel',
  'Services'
]

const OFFERS = [
  'Top Price Drops',
  'Verified Deals',
  'Lowest Today',
  'Popular Near You'
]

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSector, setActiveSector] = useState('Grocery')

  useEffect(() => {
    async function initAndLoad() {
      // Initialize basket session
      const initRes = await fetch('/api/basket/init', { method: 'POST' })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      // Load products (public read)
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
    return <div style={{ padding: 24 }}>Loading products…</div>
  }

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
      {/* SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          border: '1px solid #ddd',
          borderRadius: 12,
          marginBottom: 16
        }}
      >
        <input
          placeholder="Search for products, brands, services…"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 16
          }}
        />
        <span title="Voice Search" style={{ fontSize: 18 }}>🎤</span>
        <span title="Image Search" style={{ fontSize: 18 }}>📷</span>
      </div>

      {/* SECTOR PILLS */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid #ccc',
              background: activeSector === sector ? '#000' : '#fff',
              color: activeSector === sector ? '#fff' : '#000',
              whiteSpace: 'nowrap'
            }}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* OFFERS STRIP */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 20 }}>
        {OFFERS.map((offer) => (
          <div
            key={offer}
            style={{
              minWidth: 160,
              padding: 12,
              background: '#f7f7f7',
              borderRadius: 10,
              fontWeight: 500
            }}
          >
            {offer}
          </div>
        ))}
      </div>

      {/* PRODUCT RESULTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ fontWeight: 600 }}>{product.product_name}</div>
            <div style={{ fontSize: 14 }}>₹{product.price}</div>

            <button
              onClick={() => addToBasket(product)}
              style={{
                marginTop: 'auto',
                padding: '8px 10px',
                borderRadius: 8,
                background: '#000',
                color: '#fff',
                border: 'none'
              }}
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
