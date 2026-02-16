'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'ondc' | 'local'
}

/* -------------------------
   QUERY TYPE CHECK
-------------------------- */
function isProductLike(query: string) {
  if (!query) return false
  if (/\d/.test(query)) return true
  if (query.trim().split(' ').length >= 2) return true
  return false
}

/* -------------------------
   SECTOR INFERENCE (SEARCH)
-------------------------- */
function inferSector(query: string) {
  const q = query.toLowerCase()

  if (['iphone', 'mobile', 'laptop', 'tv', 'samsung', 'oneplus'].some(k => q.includes(k)))
    return 'electronics'

  if (['shirt', 'jeans', 'shoes', 'running', 'fashion', 'dress'].some(k => q.includes(k)))
    return 'apparel_fashion'

  if (['biryani', 'pizza', 'food', 'restaurant'].some(k => q.includes(k)))
    return 'food'

  if (['grocery', 'vegetables', 'fruits'].some(k => q.includes(k)))
    return 'grocery'

  if (['medicine', 'tablet', 'pharmacy'].some(k => q.includes(k)))
    return 'pharmacy'

  if (['salon', 'spa', 'beauty', 'wellness'].some(k => q.includes(k)))
    return 'beauty_wellness'

  if (['uber', 'ola', 'cab', 'taxi', 'ride'].some(k => q.includes(k)))
    return 'mobility'

  if (['repair', 'plumber', 'cleaning', 'service'].some(k => q.includes(k)))
    return 'home_services'

  return null
}

/* -------------------------
   MERCHANT SECTION
-------------------------- */
function MerchantSection({
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
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</h2>

      {merchants.map(m => (
        <div
          key={m.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{m.display_name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
          </div>

          <a
            href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
            style={{
              background: '#111827',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 8,
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

/* -------------------------
   RESULTS PAGE
-------------------------- */
function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()

  const query = params.get('q') || ''
  const sectorFromUrl = params.get('sector')

  const sector = useMemo(() => {
    if (sectorFromUrl) return sectorFromUrl
    return inferSector(query)
  }, [query, sectorFromUrl])

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

  const cuelinks = merchants.filter(m => m.affiliate_network === 'cuelinks')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 20 }}>
      <button onClick={() => router.back()} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        {query ? `Compare sellers for “${query}”` : sector ? `Browse ${sector.replace('_', ' ')}` : 'Browse'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <MerchantSection title="Online platforms" merchants={cuelinks} query={query} />
          <MerchantSection title="ONDC sellers" merchants={ondc} query={query} />
          <MerchantSection title="Nearby stores" merchants={local} query={query} />
        </>
      )}
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
