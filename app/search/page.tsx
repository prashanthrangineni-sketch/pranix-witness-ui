'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  sector: string
}

const SECTORS = [
  'All',
  'Grocery',
  'Electronics',
  'Pharmacy',
  'Fashion',
  'Travel',
  'Services',
]

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSector, setActiveSector] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function initAndLoad() {
      const initRes = await fetch('/api/basket/init', { method: 'POST' })
      const initData = await initRes.json()
      localStorage.setItem('cart2save_session', initData.session_id)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=id,product_name,price,sector`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      )

      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }

    initAndLoad()
  }, [])

  async function addToBasket(productId: string) {
    const sessionId = localStorage.getItem('cart2save_session')
    if (!sessionId) return alert('Session missing')

    await fetch('/api/basket/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({ product_uuid: productId, quantity: 1 }),
    })

    alert('Added to basket')
  }

  const visibleProducts = products.filter((p) => {
    const matchesSector =
      activeSector === 'All' || p.sector?.toLowerCase() === activeSector.toLowerCase()
    const matchesQuery = p.product_name.toLowerCase().includes(query.toLowerCase())
    return matchesSector && matchesQuery
  })

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* Search Bar */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            padding: 12,
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, services…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
            }}
          />
          <button onClick={() => alert('Voice search coming soon 🎤')}>🎤</button>
          <button onClick={() => alert('Image search coming soon 📸')}>📸</button>
        </div>
      </div>

      {/* Sector Pills */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: '0 16px',
          overflowX: 'auto',
        }}
      >
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSector(s)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: activeSector === s ? '#000' : '#fff',
              color: activeSector === s ? '#fff' : '#000',
              fontWeight: 600,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Deals Strip */}
      <div style={{ padding: 16, fontWeight: 700 }}>
        🔥 Top Price Deals
      </div>

      {/* Products */}
      <div style={{ padding: 16, display: 'grid', gap: 14 }}>
        {visibleProducts.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {p.product_name}
            </div>
            <div style={{ color: '#666', fontSize: 13 }}>{p.sector}</div>
            <div style={{ fontSize: 20, fontWeight: 800, margin: '8px 0' }}>
              ₹{p.price}
            </div>
            <button
              onClick={() => addToBasket(p.id)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 10,
                background: '#000',
                color: '#fff',
                fontWeight: 700,
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
