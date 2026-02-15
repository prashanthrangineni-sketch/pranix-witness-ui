'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Partner = {
  id: string
  slug: string
  display_name: string
  sector: string
}

function isLikelyProduct(query: string) {
  const q = query.toLowerCase()

  if (/\d/.test(q)) return true
  if (q.includes('gb') || q.includes('inch')) return true

  const brands = [
    'iphone',
    'samsung',
    'oneplus',
    'xiaomi',
    'nike',
    'adidas',
    'puma',
    'sony',
    'lg',
  ]

  return brands.some((b) => q.includes(b))
}

function MerchantList({ query }: { query: string }) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPartners() {
      const { data } = await supabase
        .from('affiliate_partners')
        .select('id, slug, display_name, sector')
        .eq('is_active', true)

      setPartners(data || [])
      setLoading(false)
    }

    loadPartners()
  }, [])

  if (loading) {
    return <div>Loading sellers…</div>
  }

  return (
    <section style={{ display: 'grid', gap: '12px' }}>
      {partners.map((p) => (
        <div
          key={p.id}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{p.display_name}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Online platform
            </div>
          </div>

          <a
            href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View on {p.display_name} →
          </a>
        </div>
      ))}
    </section>
  )
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const isProduct = useMemo(() => isLikelyProduct(query), [query])

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
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
          {isProduct
            ? `Compare sellers for “${query}”`
            : `Explore platforms for “${query}”`}
        </h1>
      </div>

      {/* TRUST MESSAGE */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '14px',
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '20px',
        }}
      >
        {isProduct ? (
          <>
            We show platforms where this product may be available.
            Prices and checkout happen on the seller’s website.
          </>
        ) : (
          <>
            Browse platforms and stores where this category is available.
            You’ll be redirected to view products and prices.
          </>
        )}
      </div>

      <MerchantList query={query} />
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
