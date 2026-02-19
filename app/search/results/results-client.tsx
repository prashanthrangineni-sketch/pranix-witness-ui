'use client'

import { useEffect, useMemo, useState } from 'react'
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
function MerchantCard({
  merchant,
  query,
}: {
  merchant: Merchant
  query: string
}) {
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
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontWeight: 500 }}>{merchant.display_name}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
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
            textDecoration: 'none',
          }}
        >
          View →
        </a>
      )}
    </div>
  )
}

/* ---------------------------------
   SECTION (UNCHANGED)
---------------------------------- */
function MerchantSection({
  title,
  merchants,
  query,
}: {
  title: string
  merchants: Merchant[]
  query: string
}) {
  return (
    <>
      <h2 style={{ marginTop: 24 }}>{title}</h2>
      {merchants.length === 0 && (
        <div style={{ color: '#6b7280' }}>Coming soon</div>
      )}
      {merchants.map(m => (
        <MerchantCard key={m.id} merchant={m} query={query} />
      ))}
    </>
  )
}

/* ---------------------------------
   MAIN PAGE (FIXED)
---------------------------------- */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  const query = params.get('q') || ''
  const sectorParam = params.get('sector')

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  // Step 1: Resolve sector
  useEffect(() => {
    async function resolveSector() {
      if (sectorParam) {
        setSector(sectorParam)
        return
      }

      // Try fast local logic first
      const localSector = resolveSectorFromQueryLocal(query)
      if (localSector) {
        setSector(localSector)
        return
      }

      // Fallback: Supabase keyword mapping
      const { data } = await supabase
        .from('intent_keywords')
        .select('sector')
        .ilike('keyword', query)
        .limit(1)
        .single()

      setSector(data?.sector || null)
    }

    resolveSector()
  }, [query, sectorParam])

  // Step 2: Fetch merchants once sector is known
  useEffect(() => {
    if (!sector) {
      setMerchants([])
      setLoading(false)
      return
    }

    supabase
      .from('affiliate_partners')
      .select(
        'id, slug, display_name, sector, affiliate_network, affiliate_wrap_type'
      )
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

      <h1 style={{ margin: '16px 0' }}>
        Showing results for {sector || 'search'}
      </h1>

      <p style={{ fontSize: 12, color: '#6b7280' }}>
        Cart2Save routes users to platforms. Prices and checkout happen on partner sites.
      </p>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <MerchantSection title="Online platforms" merchants={online} query={query} />
          <MerchantSection title="ONDC network" merchants={ondc} query={query} />
          <MerchantSection title="Local merchants" merchants={local} query={query} />
        </>
      )}
    </main>
  )
}
