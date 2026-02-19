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
   FAST LOCAL SECTOR HINTS (unchanged)
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
        <a href={`/api/out?m=${merchant.slug}&q=${encodeURIComponent(query)}`} style={{ background: '#111', color: '#fff', padding: '8px 12px', borderRadius: 8 }}>
          View →
        </a>
      )}
    </div>
  )
}

/* ---------------------------------
   MAIN PAGE (FIXED)
---------------------------------- */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()
  const query = (params.get('q') || '').toLowerCase()

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  // Resolve sector
  useEffect(() => {
    async function resolveSector() {
      // 1️⃣ Try fast local hints
      const local = resolveSectorFromQueryLocal(query)
      if (local) {
        setSector(local)
        return
      }

      // 2️⃣ Supabase keyword dictionary
      const { data: keywords } = await supabase
        .from('intent_keywords')
        .select('keyword, sector')

      const match = keywords?.find(k =>
        query.includes(k.keyword.toLowerCase())
      )

      setSector(match?.sector || null)
    }

    resolveSector()
  }, [query])

  // Fetch merchants
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

  const online = merchants.filter(m =>
    ['cuelinks', 'amazon', 'discovery'].includes(m.affiliate_network)
  )
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>
      <h1>Showing results for {sector || 'search'}</h1>

      {loading && <div>Loading…</div>}

      {!loading && (
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
