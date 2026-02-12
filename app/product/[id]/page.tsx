'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Product = {
  id: string
  product_name: string
  description?: string
  price: number
  original_price?: number
  merchant_id: string
  image_url_1?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=*`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      )

      const data = await res.json()
      setProduct(data[0] || null)
      setLoading(false)
    }

    loadProduct()
  }, [productId])

  async function addToBasket() {
    const sessionId = localStorage.getItem('cart2save_session')
    if (!sessionId || !product) {
      alert('No active session')
      return
    }

    await fetch('/api/basket/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        product_uuid: product.id,
        quantity: 1,
      }),
    })

    alert('Added to basket')
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading product…</div>
  }

  if (!product) {
    return <div style={{ padding: 24 }}>Product not found</div>
  }

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : null

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: 280,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {product.image_url_1 ? (
          <img
            src={product.image_url_1}
            alt={product.product_name}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        ) : (
          <span>No image</span>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          {product.product_name}
        </h1>

        {/* Price */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            ₹{product.price}
          </span>
          {product.original_price && (
            <span
              style={{
                marginLeft: 10,
                textDecoration: 'line-through',
                color: '#777',
              }}
            >
              ₹{product.original_price}
            </span>
          )}
          {discount && (
            <span
              style={{
                marginLeft: 10,
                color: '#1a7f37',
                fontWeight: 600,
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Merchant */}
        <div
          style={{
            fontSize: 14,
            color: '#555',
            marginBottom: 12,
          }}
        >
          Sold by merchant • Neutral listing
        </div>

        {/* Description */}
        {product.description && (
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#444' }}>
            {product.description}
          </p>
        )}

        {/* Trust Strip */}
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: '#f9fafb',
            borderRadius: 8,
            fontSize: 13,
            color: '#555',
          }}
        >
          Price snapshot captured • No paid ranking • Redirect-only platform
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #eee',
          padding: 12,
          display: 'flex',
          gap: 12,
        }}
      >
        <button
          onClick={addToBasket}
          style={{
            flex: 1,
            padding: 14,
            background: '#000',
            color: '#fff',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Add to Basket
        </button>

        <button
          onClick={() => router.push('/basket')}
          style={{
            flex: 1,
            padding: 14,
            background: '#f1f1f1',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          View Basket
        </button>
      </div>
    </div>
  )
}
