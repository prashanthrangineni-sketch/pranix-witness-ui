'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SectorGrid from './components/SectorGrid'
import FeaturedExamples from './components/FeaturedExamples'

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function goToResults() {
    if (!query.trim()) return
    router.push(`/search/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HERO */}
      <section style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '34px',
            fontWeight: 900,
            lineHeight: '1.15',
            marginBottom: '12px',
            letterSpacing: '-0.3px',
          }}
        >
          Best price.
          <br />
          Every time.
        </h1>

        <p
          style={{
            fontSize: '17px',
            color: '#4b5563',
            marginBottom: '20px',
            maxWidth: '560px',
          }}
        >
          Compare real prices across food, grocery, pharmacy, electronics,
          fashion, mobility, and home services — transparently.
        </p>

        <button
          onClick={() => router.push('/search')}
          style={{
            display: 'inline-block',
            padding: '15px 20px',
            borderRadius: '14px',
            backgroundColor: '#111827',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Start comparing prices
        </button>
      </section>

      {/* 🔍 REAL SEARCH INPUT (FIXED) */}
      <section style={{ marginBottom: '36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                goToResults()
              }
            }}
            placeholder="Search products, brands, services…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: 500,
              color: '#111827',
            }}
          />
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div
        style={{
          height: '1px',
          background: '#e5e7eb',
          margin: '32px 0',
        }}
      />

      {/* SECTORS */}
      <SectorGrid />

      {/* SECTION DIVIDER */}
      <div
        style={{
          height: '1px',
          background: '#e5e7eb',
          margin: '32px 0',
        }}
      />

      {/* FEATURED EXAMPLES */}
      <FeaturedExamples />

      {/* TRUST STRIP */}
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '22px',
          marginTop: '36px',
          marginBottom: '28px',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          Why Cart2Save exists
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          <div>✅ No sponsored rankings</div>
          <div>✅ No fake discounts</div>
          <div>✅ No seller manipulation</div>
          <div>✅ You choose where to buy</div>
          <div>✅ Snapshot-based prices</div>
          <div>✅ Redirect-only platform</div>
        </div>
      </section>

      {/* FOOTNOTE */}
      <div
        style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '24px',
          lineHeight: '1.6',
        }}
      >
        Cart2Save does not sell products. We help you discover prices
        transparently and redirect you to the merchant of your choice.
      </div>
    </main>
  )
}
