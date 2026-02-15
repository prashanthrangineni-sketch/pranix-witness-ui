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

/* -------------------------
   1. QUERY CLASSIFICATION
-------------------------- */

function isProductLike(query: string) {
  if (/\d/.test(query)) return true
  if (query.trim().split(' ').length >= 2) return true
  return false
}

/* -------------------------
   2. SECTOR RESOLUTION
   (LOCKED MAP)
-------------------------- */

function resolveSector(query: string) {
  const q = query.toLowerCase()

  if (['iphone', 'samsung', 'mobile', 'laptop', 'tv'].some(k => q.includes(k)))
    return 'electronics'

  if (['dress', 'shirt', 'jeans', 'shoes', 'western', 'fashion'].some(k => q.includes(k)))
    return 'apparel_fashion'

  if (['biryani', 'pizza', 'restaurant', 'food'].some(k => q.includes(k)))
    return 'food'

  if (['grocery', 'vegetables', 'fruits'].some(k => q.includes(k)))
    return 'grocery'

  if (['medicine', 'tablet', 'pharmacy'].some(k => q.includes(k)))
    return 'pharmacy'

  if (['salon', 'spa', 'beauty', 'wellness'].some(k => q.includes(k)))
    return 'beauty_wellness'

  if (['cab', 'taxi', 'bike', 'ride'].some(k => q.includes(k)))
    return 'mobility'

  if (['repair', 'service', 'cleaning', 'plumber'].some(k => q.includes(k)))
    return 'home_services'

  return null // fallback
}

/* -------------------------
   3. MERCHANT LAYER UI
-------------------------- */

function MerchantLayer({
  title,
  merchants,
  query,
  cta,
}: {
  title: string
  merchants: Merchant[]
  query: string
  cta: string
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
                {title}
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
              {cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------
   4. RESULTS PAGE
-------------------------- */

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const productLike = useMemo(() => isProductLike(query), [query])
  const sector = useMemo(() => resolveSector(query), [query])

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!sector) {
        setMerchants([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('affiliate_partners')
        .select('id, slug, display_name, sector, affiliate_network')
        .eq('is_active', true)
        .eq('sector', sector)

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
          : sector
          ? `Browse ${sector.replace('_', ' ')}`
          : `Browse platforms`}
      </h1>

      {loading && <div>Loading platforms…</div>}

      {!loading && (
        <>
          <MerchantLayer
            title="Online platforms"
            merchants={affiliate}
            query={query}
            cta={productLike ? 'View prices' : 'Explore'}
          />
          <MerchantLayer
            title="ONDC sellers"
            merchants={ondc}
            query={query}
            cta={productLike ? 'View prices' : 'Explore'}
          />
          <MerchantLayer
            title="Nearby stores"
            merchants={local}
            query={query}
            cta={productLike ? 'View prices' : 'Explore'}
          />
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
