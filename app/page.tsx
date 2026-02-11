'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  sector: string
  merchant_id: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')

        if (!res.ok) {
          throw new Error('Failed to load products')
        }

        const data = await res.json()

        if (!data || !Array.isArray(data.products)) {
          throw new Error('Invalid product data')
        }

        setProducts(data.products)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <div style={{ padding: 20 }}>Loading products…</div>
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        Error: {error}
      </div>
    )
  }

  if (products.length === 0) {
    return <div style={{ padding: 20 }}>No products available</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ccc',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8
          }}
        >
          <strong>{product.name}</strong>
          <div>₹{product.price}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Sector: {product.sector}
          </div>
        </div>
      ))}
    </div>
  )
}
