'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

function isLikelyProduct(query: string) {
  const q = query.toLowerCase()

  // numbers, models, sizes, years
  if (/\d/.test(q)) return true
  if (q.includes('gb') || q.includes('inch')) return true

  // common brand indicators
  const brands = [
    'iphone', 'samsung', 'oneplus', 'xiaomi',
    'nike', 'adidas', 'puma', 'sony', 'lg'
  ]
  return brands.some(b => q.includes(b))
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
        <button onClick={() => router.push('/search')} style={{ border: 'none', background: 'none', fontSize: 20 }}>
          ←
        </button>

        <h1 style={{ fontSize: 18, fontWeight: 700 }}>
          {isProduct
            ? `Compare sellers for “${query}”`
            : `Explore platforms for “${query}”`}
        </h1>
      </div>

      {/* TRUST COPY */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20
      }}>
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

      {/* MERCHANT LIST */}
      <MerchantList query={query} />
    </main>
  )
}

function MerchantList({ query }: { query: string }) {
  const [partners, setPartners] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector')
      .eq('is_active', true)
      .then(({ data }) => {
        setPartners(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading sellers…</div>

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      {partners.map(p => (
        <div key={p.id} style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 700 }}>{p.display_name}</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Online platform
            </div>
          </div>

          <a
            href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
            style={{
              padding: '10px 14px',
              background: '#111827',
              color: '#fff',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {`View on ${p.display_name} →`}
          </a>
        </div>
      ))}
    </section>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
