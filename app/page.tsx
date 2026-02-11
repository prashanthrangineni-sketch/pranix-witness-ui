'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  product_name: string
  price: number
  merchant_id: string
}

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data || [])
      setLoading(false)
    }

    loadProducts()
  }, [])

  async function addToBasket(product: Product) {
    const sessionId = localStorage.getItem('cart2save_session')
    if (!sessionId) {
      alert('Session not ready')
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
      <h1>Cart2Save</h1>
      <p>Neutral discovery. Add items to basket.</p>

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
          <strong>{product.product_name}</strong>
          <div>₹{product.price}</div>

          <button
            style={{ marginTop: 8 }}
            onClick={() => addToBasket(product)}
          >
            Add to Basket
          </button>
        </div>
      ))}
    </div>
  )
}
