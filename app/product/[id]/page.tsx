'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
  description?: string
  image_url_1?: string
  sector?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=*`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          }
        }
      )

      const data = await res.json()
      setProduct(data[0])
      setLoading(false)
    }

    loadProduct()
  }, [productId])

  async function addToBasket() {
    const sessionId = localStorage.getItem('cart2save_session')
    if (!sessionId || !product) {
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
    return <div style={{ padding: 24 }}>Loading product…</div>
  }

  if (!product) {
    return <div style={{ padding: 24 }}>Product not found</div>
  }

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: 260,
          background: '#f3f3f3',
          borderRadius: 12,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }}
      >
        {product.image_url_1 ? (
          <img
            src={product.image_url_1}
            alt={product.product_name}
            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 12 }}
          />
        ) : (
          'Product Image'
        )}
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
        {product.product_name}
      </h1>

      {/* Price */}
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        ₹{product.price}
      </div>

      {/* Meta */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 12
        }}
      >
        <span
          style={{
            padding: '4px 8px',
            background: '#eee',
            borderRadius: 6,
            fontSize: 12
          }}
        >
          Merchant: {product.merchant_id}
        </span>

        {product.sector && (
          <span
            style={{
              padding: '4px 8px',
              background: '#eef6ff',
              borderRadius: 6,
              fontSize: 12
            }}
          >
            {product.sector}
          </span>
        )}
      </div>

      {/* Trust strip */}
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 13,
          color: '#555'
        }}
      >
        • Neutral listing — no paid ranking<br />
        • Price snapshot verified<br />
        • Redirects to merchant on buy
      </div>

      {/* Description */}
      {product.description && (
        <p style={{ fontSize: 14, color: '#444', marginBottom: 20 }}>
          {product.description}
        </p>
      )}

      {/* Add to basket */}
      <button
        onClick={addToBasket}
        style={{
          width: '100%',
          padding: '14px 0',
          background: '#000',
          color: '#fff',
          fontSize: 16,
          borderRadius: 10,
          border: 'none'
        }}
      >
        Add to Basket
      </button>
    </div>
  )
}
