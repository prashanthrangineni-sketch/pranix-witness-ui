'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'affiliate' | 'ondc' | 'local'
}

function detectSector(query: string) {
  const q = query.toLowerCase()

  if (['iphone', 'samsung', 'mobile', 'laptop'].some(k => q.includes(k)))
    return 'electronics'
  if (['dress', 'shirt', 'jeans', 'fashion'].some(k => q.includes(k)))
    return 'fashion'
  if (['biryani', 'food', 'restaurant'].some(k => q.includes(k)))
    return 'food'

  return 'fashion' // safe default
}

function isProductQuery(query: string) {
  return /\d/.test(query) || query.split(' ').length >= 2
}

function MerchantLayer({
  title,
  merchants,
  query,
}: {
  title: string
  merchants: Merchant[]
  query: string
}) {
  if (merchants.length === 0) return null

  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        {title}
      </h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {merchants.map(m => (
          <div
            key={m.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{m.display_name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {m.affiliate_network === 'affiliate'
                  ? 'Online platform'
                  : m.affiliate_network === 'ondc'
                  ? 'ONDC seller'
                  : 'Nearby store'}
              </div>
            </div>

            <a
              href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#111827',
                color: '#fff',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const sector = useMemo(() => detectSector(query), [query])
  const productLike = useMemo(() => isProductQuery(query), [query])

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('affiliate_partners')
        .select('*')
        .eq('is_active', true)
        .eq('sector', sector) // 🔒 HARD LOCK

      setMerchants(data || [])
      setLoading(false)
    }

    load()
  }, [sector])

  const affiliate = merchants.filter(m => m.affiliate_network === 'affiliate')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button
        onClick={() => router.push('/search')}
        style={{ background: 'none', border: 'none', fontSize: 20 }}
      >
        ←
      </button>

      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        {productLike
          ? `Compare sellers for “${query}”`
          : `Browse ${sector} platforms`}
      </h1>

      {loading && <div>Loading platforms…</div>}

      {!loading && (
        <>
          <MerchantLayer title="Online platforms" merchants={affiliate} query={query} />
          <MerchantLayer title="ONDC sellers" merchants={ondc} query={query} />
          <MerchantLayer title="Nearby stores" merchants={local} query={query} />
        </>
      )}
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
