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
}

/* ---------------------------------
   FAST LOCAL SECTOR HINTS (SAFE)
---------------------------------- */
function resolveSectorFromQueryLocal(q: string | null) {
  if (!q) return null
  const query = q.toLowerCase()

  if (query.includes('iphone') || query.includes('mobile')) return 'electronics'
  if (query.includes('shirt') || query.includes('jeans') || query.includes('shoes')) return 'apparel_fashion'
  if (query.includes('medicine') || query.includes('pharma')) return 'pharmacy'
  if (query.includes('food') || query.includes('biryani') || query.includes('dosa')) return 'food'
  if (query.includes('grocery')) return 'grocery'
  if (query.includes('beauty') || query.includes('cream') || query.includes('shampoo')) return 'beauty_wellness'
  if (query.includes('cab') || query.includes('ride') || query.includes('taxi')) return 'mobility'

  return null
}

/* ---------------------------------
   MERCHANT CARD (UNCHANGED)
---------------------------------- */
function MerchantCard({ merchant, query }: { merchant: Merchant; query: string }) {
  const isDiscovery = merchant.affiliate_wrap_type === 'discovery'

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
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
          style={{
            background: '#111',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 8,
            textDecoration: 'none'
          }}
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

  const rawQuery = params.get('q')
  const query = rawQuery ? rawQuery.toLowerCase() : ''

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------------------------
     RESOLVE SECTOR (SAFE + LOGGING)
  ---------------------------------- */
  useEffect(() => {
    async function resolveSector() {
      // CASE 1: User clicked sector card (no query)
      if (!query) {
        setSector(null)
        setLoading(false)
        return
      }

      // 1️⃣ Fast local hints
      const localSector = resolveSectorFromQueryLocal(query)
      if (localSector) {
        await supabase.from('search_logs').insert({
          raw_query: query,
          resolved_sector: localSector,
          resolution_source: 'local_hint'
        })
        setSector(localSector)
        return
      }

      // 2️⃣ Keyword dictionary (Supabase)
      const { data: keywords } = await supabase
        .from('sector_keywords')
        .select('keyword, sector')
        .eq('is_active', true)

      const found = keywords?.find(k =>
        query.includes(k.keyword.toLowerCase())
      )

      const resolvedSector = found ? found.sector : null

      // 🔹 LOG SEARCH
      await supabase.from('search_logs').insert({
        raw_query: query,
        resolved_sector: resolvedSector,
        resolution_source: found ? 'keyword' : 'unmatched'
      })

      setSector(resolvedSector)
    }

    resolveSector()
  }, [query])

  /* ---------------------------------
     FETCH MERCHANTS
  ---------------------------------- */
  useEffect(() => {
    async function fetchMerchants() {
      // CASE 1: Sector click → show all merchants
      if (!sector && !query) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('id, slug, display_name, sector, affiliate_network, affiliate_wrap_type')
          .eq('is_active', true)

        setMerchants(data || [])
        setLoading(false)
        return
      }

      // CASE 2: Resolved sector
      if (sector) {
        const { data } = await supabase
          .from('affiliate_partners')
          .select('id, slug, display_name, sector, affiliate_network, affiliate_wrap_type')
          .eq('is_active', true)
          .eq('sector', sector)

        setMerchants(data || [])
        setLoading(false)
        return
      }

      // CASE 3: No match
      setMerchants([])
      setLoading(false)
    }

    fetchMerchants()
  }, [sector, query])

  const online = merchants.filter(m =>
    ['cuelinks', 'amazon', 'discovery'].includes(m.affiliate_network)
  )
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
          {online.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}

          <h2>ONDC network</h2>
          {ondc.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}

          <h2>Local merchants</h2>
          {local.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}
        </>
      )}
    </main>
  )
}
