'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
        { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } }
      )
      const data = await res.json()
      setProduct(data[0])
    }
    load()
  }, [id])

  if (!product) return <div style={{ padding: 24 }}>Loading…</div>

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <img
        src={product.image_url_1 || 'https://via.placeholder.com/600'}
        style={{ width: '100%', borderRadius: 14, marginBottom: 16 }}
      />

      <h1 style={{ fontSize: 24, fontWeight: 800 }}>
        {product.product_name}
      </h1>

      <p style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>
        ₹{product.price}
      </p>

      <button
        style={{
          marginTop: 20,
          width: '100%',
          padding: '14px 0',
          background: '#111',
          color: '#fff',
          borderRadius: 12,
          fontWeight: 800,
          border: 'none'
        }}
      >
        Add to Basket
      </button>
    </div>
  )
}
