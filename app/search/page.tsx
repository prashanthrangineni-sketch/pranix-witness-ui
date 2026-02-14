'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  slug: string
  display_name: string
  sector: string
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMerchants()
  }, [])

  async function fetchMerchants() {
    setLoading(true)

    const { data, error } = await supabase
      .from('affiliate_partners')
      .select('slug, display_name, sector')
      .eq('is_active', true)

    if (!error && data) {
      setMerchants(data)
    }

    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => router.push('/search')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Loading platforms…
        </div>
      )}

      {/* MERCHANT LIST */}
      {!loading && merchants.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
          }}
        >
          {merchants.map((m) => (
            <a
              key={m.slug}
              href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: '#111827',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {m.display_name}
            </a>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && merchants.length === 0 && (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          No platforms available for this search yet.
        </div>
      )}

      {/* FOOT NOTE */}
      <div
        style={{
          marginTop: '28px',
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: '1.6',
        }}
      >
        Cart2Save is a neutral discovery platform. Prices and availability are
        determined by the merchant. You will be redirected to the seller’s
        website to complete your purchase.
      </div>
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading results…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
