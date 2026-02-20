'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

/* ---------------------------------
   TYPES
---------------------------------- */
type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'amazon' | 'ondc' | 'local' | 'discovery'
  affiliate_wrap_type: 'cuelinks' | 'direct' | 'discovery'
}

/* ---------------------------------
   UNIT LOGIC (HIGHEST PRIORITY)
---------------------------------- */
function resolveByUnit(query: string): string | null {
  if (/\b\d+\s?(mg|ml|tablet|capsule|strip)\b/.test(query)) return 'pharmacy'
  if (/\b\d+\s?(kg|g|gram|litre|liter|packet)\b/.test(query)) return 'grocery'
  return null
}

/* ---------------------------------
   FAST LOCAL HINTS (SAFE FALLBACK)
---------------------------------- */
function resolveLocalHint(query: string): string | null {
  if (query.includes('mobile') || query.includes('iphone')) return 'electronics'
  if (query.includes('shirt') || query.includes('jeans') || query.includes('shoes')) return 'apparel_fashion'
  if (query.includes('cab') || query.includes('ride') || query.includes('taxi')) return 'mobility'
  if (query.includes('biryani') || query.includes('dosa') || query.includes('food')) return 'food'
  if (query.includes('cream') || query.includes('shampoo')) return 'beauty_wellness'
  return null
}

/* ---------------------------------
   MERCHANT CARD (UNCHANGED)
---------------------------------- */
function MerchantCard({ merchant, query }: { merchant: Merchant; query: string }) {
  const isDiscovery = merchant.affiliate_wrap_type === 'discovery'

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{merchant.display_name}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {isDiscovery ? 'Discovery' : 'Affiliate partner'}
        </div>
      </div>

      {isDiscovery ? (
        <span style={{ color: '#9ca3af' }}>View →</span>
      ) : (
        <a
          href={`/api/out?m=${merchant.slug}&q=${encodeURIComponent(query)}`}
          style={{ background: '#111', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}
        >
          View →
        </a>
      )}
    </div>
  )
}

/* ---------------------------------
   MAIN RESULTS PAGE
---------------------------------- */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  const rawQuery = params.get('q') || ''
  const query = rawQuery.trim().toLowerCase()
  const sectorFromUrl = params.get('sector')

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------------------------
     RESOLVE SECTOR (STRICT & SAFE)
  ---------------------------------- */
  useEffect(() => {
    async function resolveSector() {
      setLoading(true)

      // FLOW 1: Sector card click
      if (sectorFromUrl) {
        setSector(sectorFromUrl)
        setLoading(false)
        return
      }

      // FLOW 2: Search
      if (query) {
        // 1️⃣ Unit logic
        const unitSector = resolveByUnit(query)
        if (unitSector) {
          await supabase.from('search_logs').insert({
            raw_query: query,
            resolved_sector: unitSector,
            resolution_source: 'unit'
          })
          setSector(unitSector)
          setLoading(false)
          return
        }

        // 2️⃣ Phrase dominance from DB
        const { data: keywords } = await supabase
          .from('sector_keywords')
          .select('keyword, sector')
          .eq('is_active', true)

        const sorted = (keywords || []).sort(
          (a, b) => b.keyword.length - a.keyword.length
        )

        const match = sorted.find(k =>
          query.includes(k.keyword.toLowerCase())
        )

        if (match) {
          await supabase.from('search_logs').insert({
            raw_query: query,
            resolved_sector: match.sector,
            resolution_source: 'keyword'
          })
          setSector(match.sector)
          setLoading(false)
          return
        }

        // 3️⃣ Local hint fallback
        const local = resolveLocalHint(query)
        if (local) {
          await supabase.from('search_logs').insert({
            raw_query: query,
            resolved_sector: local,
            resolution_source: 'local_hint'
          })
          setSector(local)
          setLoading(false)
          return
        }

        // 4️⃣ Unmatched
        await supabase.from('search_logs').insert({
          raw_query: query,
          resolved_sector: null,
          resolution_source: 'unmatched'
        })

        setSector(null)
        setLoading(false)
        return
      }

      // FLOW 3: Browse
      setSector(null)
      setLoading(false)
    }

    resolveSector()
  }, [query, sectorFromUrl])

  /* ---------------------------------
     FETCH MERCHANTS (STRICT)
  ---------------------------------- */
  useEffect(() => {
    async function fetchMerchants() {
      // Sector resolved
      if (sector) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('*')
          .eq('is_active', true)
          .eq('sector', sector)

        setMerchants(data || [])
        return
      }

      // Browse only
      if (!query && !sectorFromUrl) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('*')
          .eq('is_active', true)

        setMerchants(data || [])
        return
      }

      // No results
      setMerchants([])
    }

    fetchMerchants()
  }, [sector, query, sectorFromUrl])

  const online = merchants.filter(m => ['cuelinks', 'amazon', 'discovery'].includes(m.affiliate_network))
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>

      <h1 style={{ marginTop: 16 }}>
        {sector ? `Showing results for ${sector}` : 'Browse platforms'}
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
