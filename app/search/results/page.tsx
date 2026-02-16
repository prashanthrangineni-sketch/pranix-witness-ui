'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: string
}

/* ------------------------
   SECTOR AUTO RESOLUTION
------------------------- */
function resolveSectorFromQuery(q: string | null): string | null {
  if (!q) return null
  const s = q.toLowerCase()

  if (['iphone', 'samsung', 'mobile', 'laptop', 'tv'].some(k => s.includes(k)))
    return 'electronics'
  if (['dress', 'shirt', 'jeans', 'shoes', 'fashion', 'western'].some(k => s.includes(k)))
    return 'apparel_fashion'
  if (['biryani', 'pizza', 'restaurant', 'food'].some(k => s.includes(k)))
    return 'food'
  if (['grocery', 'vegetable', 'fruit'].some(k => s.includes(k)))
    return 'grocery'
  if (['medicine', 'tablet', 'pharmacy'].some(k => s.includes(k)))
    return 'pharmacy'
  if (['salon', 'spa', 'beauty', 'wellness'].some(k => s.includes(k)))
    return 'beauty_wellness'
  if (['cab', 'taxi', 'ride', 'uber'].some(k => s.includes(k)))
    return 'mobility'
  if (['repair', 'cleaning', 'plumber', 'service'].some(k => s.includes(k)))
    return 'home_services'

  return null
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
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              background: '#fff',
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
                textDecoration: 'none',
                fontWeight: 600,
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
  const router = useRouter()
  const params = useSearchParams()

  const query = params.get('q') || ''
  const sectorFromUrl = params.get('sector')
  const sector = sectorFromUrl || resolveSectorFromQuery(query)

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

  const online = merchants.filter(m => m.affiliate_network === 'cuelinks')
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
        Showing results for {sector?.replace('_', ' ')}
      </h1>

      {loading && <div>Loading platforms…</div>}

      {!loading && (
        <>
          <MerchantLayer title="Online platforms" merchants={online} query={query || sector!} />
          <MerchantLayer title="ONDC sellers" merchants={ondc} query={query || sector!} />
          <MerchantLayer title="Nearby stores" merchants={local} query={query || sector!} />
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
