'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'ondc' | 'local'
}

/* ---------------------------------
   SECTOR RESOLUTION (SAFE)
---------------------------------- */

function resolveSectorFromQuery(q: string | null) {
  if (!q) return null
  const query = q.toLowerCase()

  if (['iphone', 'mobile', 'laptop', 'tv'].some(k => query.includes(k)))
    return 'electronics'
  if (['shirt', 'shoes', 'jeans', 'fashion', 'western'].some(k => query.includes(k)))
    return 'apparel_fashion'
  if (['grocery', 'vegetables', 'fruits'].some(k => query.includes(k)))
    return 'grocery'
  if (['medicine', 'tablet', 'pharmacy'].some(k => query.includes(k)))
    return 'pharmacy'
  if (['food', 'restaurant', 'biryani', 'pizza'].some(k => query.includes(k)))
    return 'food'
  if (['beauty', 'wellness', 'salon', 'spa'].some(k => query.includes(k)))
    return 'beauty_wellness'
  if (['cab', 'taxi', 'ride', 'uber'].some(k => query.includes(k)))
    return 'mobility'
  if (['repair', 'cleaning', 'service', 'plumber'].some(k => query.includes(k)))
    return 'home_services'

  return null
}

/* ---------------------------------
   LAYER UI
---------------------------------- */

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
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 600 }}>{m.display_name}</div>

            <a
              href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
              style={{
                background: '#111',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: 8,
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

/* ---------------------------------
   RESULTS PAGE
---------------------------------- */

export default function SearchResultsPage() {
  const router = useRouter()
  const params = useSearchParams()

  const query = params.get('q') || ''
  const sectorParam = params.get('sector')

  const sector = useMemo(
    () => sectorParam || resolveSectorFromQuery(query),
    [sectorParam, query]
  )

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) {
      setMerchants([])
      setLoading(false)
      return
    }

    supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector, affiliate_network')
      .eq('is_active', true)
      .eq('sector', sector)
      .then(({ data }) => {
        setMerchants(data || [])
        setLoading(false)
      })
  }, [sector])

  const online = merchants.filter(m => m.affiliate_network === 'cuelinks')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.push('/search')}>← Back</button>

      <h1 style={{ margin: '16px 0' }}>
        {query ? `Compare sellers for “${query}”` : `Browse ${sector}`}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <MerchantLayer
            title="Online platforms"
            merchants={online}
            query={query}
            cta="View prices"
          />

          <MerchantLayer
            title="ONDC sellers (Coming soon)"
            merchants={ondc}
            query={query}
            cta="Explore"
          />

          <MerchantLayer
            title="Nearby stores (Coming soon)"
            merchants={local}
            query={query}
            cta="Explore"
          />
        </>
      )}

      {!loading && merchants.length === 0 && (
        <div>No platforms available for this sector</div>
      )}
    </main>
  )
}
