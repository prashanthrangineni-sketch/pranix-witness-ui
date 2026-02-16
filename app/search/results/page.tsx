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

/* ---------- AUTO SECTOR DETECTION ---------- */

function resolveSector(query: string | null, explicitSector: string | null) {
  if (explicitSector) return explicitSector
  if (!query) return null

  const q = query.toLowerCase()

  if (['iphone', 'samsung', 'mobile', 'laptop', 'tv'].some(k => q.includes(k)))
    return 'electronics'
  if (['shoe', 'shirt', 'jeans', 'fashion', 'dress'].some(k => q.includes(k)))
    return 'apparel_fashion'
  if (['medicine', 'tablet', 'pharmacy'].some(k => q.includes(k)))
    return 'pharmacy'
  if (['grocery', 'rice', 'oil'].some(k => q.includes(k)))
    return 'grocery'
  if (['salon', 'spa', 'beauty'].some(k => q.includes(k)))
    return 'beauty_wellness'
  if (['cab', 'taxi', 'ride'].some(k => q.includes(k)))
    return 'mobility'
  if (['repair', 'plumber', 'cleaning'].some(k => q.includes(k)))
    return 'home_services'
  if (['food', 'restaurant', 'biryani'].some(k => q.includes(k)))
    return 'food'

  return null
}

/* ---------- UI LAYER ---------- */

function MerchantSection({ title, merchants, query }: any) {
  if (merchants.length === 0) return null

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 12 }}>{title}</h3>

      {merchants.map((m: Merchant) => (
        <div
          key={m.id}
          style={{
            padding: 14,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <div>{m.display_name}</div>
          <a
            href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query || '')}`}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#111827',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            View prices →
          </a>
        </div>
      ))}
    </section>
  )
}

function ResultsContent() {
  const router = useRouter()
  const params = useSearchParams()

  const query = params.get('q')
  const sectorParam = params.get('sector')
  const sector = useMemo(() => resolveSector(query, sectorParam), [query, sectorParam])

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) {
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

  if (!sector) {
    return (
      <main style={{ padding: 24 }}>
        <button onClick={() => router.push('/search')}>← Back</button>
        <p>Please search for a product or select a category.</p>
      </main>
    )
  }

  const online = merchants.filter(m => m.affiliate_network === 'cuelinks')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.push('/search')}>← Back</button>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>
        Browse {sector.replace('_', ' ')}
      </h1>

      {loading && <p>Loading…</p>}

      {!loading && (
        <>
          <MerchantSection title="Online platforms" merchants={online} query={query} />
          <MerchantSection title="ONDC sellers" merchants={ondc} query={query} />
          <MerchantSection title="Nearby stores" merchants={local} query={query} />
        </>
      )}
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
