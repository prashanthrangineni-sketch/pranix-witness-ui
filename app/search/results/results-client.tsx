'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

/* ---------------------------------
   TYPES (UNCHANGED)
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
   FAST LOCAL SECTOR HINTS (UNCHANGED)
---------------------------------- */
function resolveSectorFromQueryLocal(q: string | null) {
  if (!q) return null
  const query = q.toLowerCase()

  if (query.includes('iphone') || query.includes('mobile')) return 'electronics'
  if (query.includes('shirt') || query.includes('shoes')) return 'apparel_fashion'
  if (query.includes('grocery')) return 'grocery'
  if (query.includes('medicine') || query.includes('pharma')) return 'pharmacy'
  if (query.includes('food')) return 'food'
  if (query.includes('beauty')) return 'beauty_wellness'
  if (query.includes('cab') || query.includes('ride')) return 'mobility'

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
        justifyContent: 'space-between'
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
   MAIN RESULTS PAGE (FIXED & SAFE)
---------------------------------- */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  // Query typed by user
  const query = (params.get('q') || '').toLowerCase()

  // Sector selected by clicking sector card
  const sectorFromUrl = params.get('sector')

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------------------------
     RESOLVE SECTOR (SAFE ORDER)
  ---------------------------------- */
  useEffect(() => {
    async function resolveSector() {
      setLoading(true)

      // 1️⃣ Sector click (NO intent logic)
      if (sectorFromUrl) {
        setSector(sectorFromUrl)
        return
      }

      // 2️⃣ Nothing typed
      if (!query) {
        setSector(null)
        setLoading(false)
        return
      }

      // 3️⃣ Fast local hints
      const local = resolveSectorFromQueryLocal(query)
      if (local) {
        setSector(local)
        return
      }

      // 4️⃣ Supabase intent keywords
      const { data: keywords, error } = await supabase
        .from('intent_keywords')
        .select('keyword, sector')

      if (error || !keywords) {
        setSector(null)
        setLoading(false)
        return
      }

      const resolvedSector = match?.sector || null

       // 🔹 LOG SEARCH (non-blocking, safe)
       await supabase.from('search_logs').insert({
       raw_query: query,
       resolved_sector: resolvedSector,
       resolution_source: match ? 'keyword' : 'unmatched'
       })

setSector(resolvedSector)
      setLoading(false)
    }

    resolveSector()
  }, [query, sectorFromUrl])

  /* ---------------------------------
     FETCH MERCHANTS (UNCHANGED)
  ---------------------------------- */
  useEffect(() => {
    if (!sector) {
      setMerchants([])
      setLoading(false)
      return
    }

    supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector, affiliate_network, affiliate_wrap_type')
      .eq('is_active', true)
      .eq('sector', sector)
      .then(({ data }) => {
        setMerchants(data || [])
        setLoading(false)
      })
  }, [sector])

  /* ---------------------------------
     GROUP MERCHANTS
  ---------------------------------- */
  const online = merchants.filter(m =>
    ['cuelinks', 'amazon', 'discovery'].includes(m.affiliate_network)
  )
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  /* ---------------------------------
     RENDER
  ---------------------------------- */
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>

      <h1>
        Showing results for {sector || 'search'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && !sector && query && (
        <div style={{ marginTop: 24, color: '#6b7280' }}>
          No results found for “{query}”
        </div>
      )}

      {!loading && sector && (
        <>
          <h2>Online platforms</h2>
          {online.length === 0 && <div>No online platforms available</div>}
          {online.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}

          <h2>ONDC network</h2>
          {ondc.length === 0 && <div>Coming soon</div>}
          {ondc.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}

          <h2>Local merchants</h2>
          {local.length === 0 && <div>Coming soon</div>}
          {local.map(m => (
            <MerchantCard key={m.id} merchant={m} query={query} />
          ))}
        </>
      )}
    </main>
  )
}
