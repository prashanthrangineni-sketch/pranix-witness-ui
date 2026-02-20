'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'amazon' | 'ondc' | 'local' | 'discovery'
  affiliate_wrap_type: 'cuelinks' | 'direct' | 'discovery'
  affiliate_base_url: string | null
}

/* -----------------------------
   UNIT LOGIC (TOP PRIORITY)
------------------------------ */
function resolveByUnit(query: string): string | null {
  if (/\b\d+\s?(mg|ml|tablet|capsule|strip)\b/.test(query)) return 'pharmacy'
  if (/\b\d+\s?(kg|g|gram|litre|liter|packet)\b/.test(query)) return 'grocery'
  return null
}

/* -----------------------------
   COOKED FOOD OVERRIDE
------------------------------ */
function hasCookedFoodSignal(query: string) {
  return ['curry', 'gravy', 'fry', 'masala', 'biryani', 'restaurant', 'order', 'meal']
    .some(w => query.includes(w))
}

/* -----------------------------
   LOCAL FALLBACK
------------------------------ */
function resolveLocalHint(query: string): string | null {
  if (query.includes('mobile') || query.includes('iphone')) return 'electronics'
  if (query.includes('shirt') || query.includes('jeans') || query.includes('shoes')) return 'apparel_fashion'
  if (query.includes('cab') || query.includes('ride') || query.includes('taxi')) return 'mobility'
  if (query.includes('cream') || query.includes('shampoo')) return 'beauty_wellness'
  return null
}

/* -----------------------------
   MERCHANT CARD (FINAL FIX)
------------------------------ */
function MerchantCard({ merchant, query }: { merchant: Merchant; query: string }) {
  const isDiscovery = merchant.affiliate_wrap_type === 'discovery'

  if (isDiscovery) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 500 }}>{merchant.display_name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Discovery</div>
        </div>

        <a
          href={merchant.affiliate_base_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#111', fontWeight: 500 }}
        >
          View →
        </a>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{merchant.display_name}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Affiliate partner</div>
      </div>

      <a
        href={`/api/out?m=${merchant.slug}&q=${encodeURIComponent(query)}`}
        style={{ background: '#111', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}
      >
        View →
      </a>
    </div>
  )
}

/* -----------------------------
   MAIN RESULTS PAGE
------------------------------ */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  const rawQuery = params.get('q') || ''
  const query = rawQuery.trim().toLowerCase()
  const sectorFromUrl = params.get('sector')

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  /* -------- Resolve sector -------- */
  useEffect(() => {
    async function resolve() {
      setLoading(true)

      if (sectorFromUrl) {
        setSector(sectorFromUrl)
        setLoading(false)
        return
      }

      if (!query) {
        setSector(null)
        setLoading(false)
        return
      }

      const unit = resolveByUnit(query)
      if (unit) {
        setSector(unit)
        return
      }

      if (hasCookedFoodSignal(query)) {
        setSector('food')
        return
      }

      const { data } = await supabase
        .from('sector_keywords')
        .select('keyword, sector')
        .eq('is_active', true)

      const sorted = (data || []).sort((a, b) => b.keyword.length - a.keyword.length)
      const match = sorted.find(k => query.includes(k.keyword.toLowerCase()))

      if (match) {
        setSector(match.sector)
        return
      }

      const local = resolveLocalHint(query)
      setSector(local)
    }

    resolve()
  }, [query, sectorFromUrl])

  /* -------- Fetch merchants -------- */
  useEffect(() => {
    async function fetchMerchants() {
      const base = supabase.from('affiliate_partners').select('*').eq('is_active', true)

      const { data } = sector
        ? await base.eq('sector', sector)
        : await base

      setMerchants(data || [])
      setLoading(false)
    }

    fetchMerchants()
  }, [sector])

  const online = merchants.filter(m => ['cuelinks', 'amazon', 'discovery'].includes(m.affiliate_network))
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>

      <h1 style={{ marginTop: 16 }}>
        {sector ? `Showing results for "${rawQuery}" (${sector})` : 'Browse platforms'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && merchants.length === 0 && (
        <div style={{ marginTop: 24, color: '#6b7280' }}>
          No results found for this search.
        </div>
      )}

      {!loading && merchants.length > 0 && (
        <>
          <h2>Online platforms</h2>
          {online.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}

          <h2>ONDC network</h2>
          {ondc.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}

          <h2>Local merchants</h2>
          {local.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}
        </>
      )}
    </main>
  )
}
