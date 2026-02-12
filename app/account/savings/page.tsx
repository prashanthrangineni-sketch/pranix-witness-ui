'use client'

import { useEffect, useState } from 'react'

type Product = {
  price: number
  original_price?: number
}

export default function SavingsPage() {
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    async function calculateSavings() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=price,original_price`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      )

      const data: Product[] = await res.json()

      let total = 0
      data.forEach((p) => {
        if (p.original_price && p.original_price > p.price) {
          total += p.original_price - p.price
        }
      })

      setSavings(total)
    }

    calculateSavings()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
        Your Savings
      </h1>

      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          padding: 24,
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 14, color: '#666' }}>
          Total saved using Cart2Save
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 900,
            marginTop: 8,
            color: '#1a7f37',
          }}
        >
          ₹{savings}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: '#777',
          }}
        >
          Based on real price differences • No estimates
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          color: '#666',
          lineHeight: 1.6,
        }}
      >
        Cart2Save shows price snapshots from merchants and partners.
        Savings reflect the difference between original and current prices.
      </div>
    </div>
  )
}
