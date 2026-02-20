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
  website_url: string | null
}

/* -----------------------------
   PRIORITY 1: UNIT LOGIC
------------------------------ */
function resolveByUnit(q: string): string | null {
  if (/\b\d+\s?(mg|ml|tablet|capsule|strip)\b/.test(q)) return 'pharmacy'
  if (/\b\d+\s?(kg|g|gram|litre|liter|packet)\b/.test(q)) return 'grocery'
  return null
}

/* -----------------------------
   PRIORITY 2: COOKED FOOD
------------------------------ */
function hasCookedFoodSignal(q: string): boolean {
  return [
    'curry','gravy','fry','masala','biryani','restaurant','meal','order'
  ].some(w => q.includes(w))
}

/* -----------------------------
   PRIORITY 4: LOCAL HINTS
------------------------------ */
function resolveLocalHint(q: string): string | null {
  if (q.includes('iphone') || q.includes('mobile')) return 'electronics'
  if (q.includes('shirt') || q.includes('jeans') || q.includes('shoes')) return 'apparel_fashion'
  if (q.includes('cab') || q.includes('ride') || q.includes('taxi')) return 'mobility'
  if (q.includes('cream') || q.includes('shampoo')) return 'beauty_wellness'
  return null
}

/* -----------------------------
   MERCHANT CARD (LOCKED)
------------------------------ */
function MerchantCard({ merchant, query }: { merchant: Merchant; query: string }) {
  const isDiscovery = merchant.affiliate_network === 'discovery'

  if (isDiscovery) {
    const url =
      merchant.affiliate_base_url ||
      merchant.website_url ||
      '#'

    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 500 }}>{merchant.display_name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Discovery</div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 500, textDecoration: 'none' }}
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
   MAIN PAGE
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
  const [noResults, setNoResults] = useState(false)

  /* -------- RESOLVE SECTOR -------- */
  useEffect(() => {
    async function resolveSector() {
      setLoading(true)
      setNoResults(false)

      if (sectorFromUrl) {
        setSector(sectorFromUrl)
        setLoading(false)
        return
      }

      if (query) {
        let resolved =
          resolveByUnit(query) ||
          (hasCookedFoodSignal(query) ? 'food' : null)

        if (!resolved) {
          const { data } = await supabase
            .from('sector_keywords')
            .select('keyword, sector')
            .eq('is_active', true)

          const sorted = (data || []).sort((a, b) => b.keyword.length - a.keyword.length)
          const match = sorted.find(k => query.includes(k.keyword.toLowerCase()))
          if (match) resolved = match.sector
        }

        if (!resolved) resolved = resolveLocalHint(query)

        await supabase.from('search_logs').insert({
          raw_query: query,
          resolved_sector: resolved,
          resolution_source: resolved ? 'resolved' : 'unmatched'
        })

        if (!resolved) {
          setNoResults(true)
          setSector(null)
          setLoading(false)
          return
        }

        setSector(resolved)
        setLoading(false)
        return
      }

      setSector(null)
      setLoading(false)
    }

    resolveSector()
  }, [query, sectorFromUrl])

  /* -------- FETCH MERCHANTS -------- */
  useEffect(() => {
    async function fetchMerchants() {
      if (noResults) {
        setMerchants([])
        return
      }

      if (sector) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('*')
          .eq('is_active', true)
          .eq('sector', sector)

        setMerchants(data || [])
        return
      }

      if (!query && !sectorFromUrl) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('*')
          .eq('is_active', true)

        setMerchants(data || [])
      }
    }

    fetchMerchants()
  }, [sector, query, sectorFromUrl, noResults])

  const online = merchants.filter(m =>
    ['cuelinks','amazon','discovery'].includes(m.affiliate_network)
  )
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>

      <h1 style={{ marginTop: 16 }}>
        {noResults
          ? `No results for "${rawQuery}"`
          : sector
          ? `Showing results for "${rawQuery}" (${sector})`
          : 'Browse platforms'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && noResults && (
        <div style={{ marginTop: 24, color: '#6b7280' }}>
          No results found. Try a different search.
        </div>
      )}

      {!loading && !noResults && merchants.length > 0 && (
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
