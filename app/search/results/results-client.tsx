'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'ondc' | 'local'
}

/* ---------------------------------
   SAFE SECTOR DETECTION (NO AI)
---------------------------------- */
function resolveSectorFromQuery(q: string | null) {
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
   SECTION RENDERER (SAFE)
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
        <div
          key={m.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>{m.display_name}</div>

          {m.affiliate_network === 'cuelinks' ? (
            <a
              href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
              style={{
                background: '#111',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              View prices →
            </a>
          ) : (
            <span style={{ color: '#9ca3af' }}>Coming soon</span>
          )}
        </div>
      ))}
    </>
  )
}

/* ---------------------------------
   MAIN PAGE
---------------------------------- */
export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  const query = params.get('q') || ''
  const sectorParam = params.get('sector')

  const sector = useMemo(
    () => sectorParam || resolveSectorFromQuery(query),
    [sectorParam, query]
  )

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) {
      setMerchants([])
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

  const online = merchants.filter(m => m.affiliate_network === 'cuelinks')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.push('/search')}>← Back</button>

      <h1 style={{ margin: '16px 0' }}>
        Showing results for {sector || 'search'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <MerchantSection
            title="Online platforms"
            merchants={online}
            query={query}
          />

          <MerchantSection
            title="ONDC network"
            merchants={[]}   // intentionally empty
            query={query}
          />

          <MerchantSection
            title="Local merchants"
            merchants={[]}   // intentionally empty
            query={query}
          />
        </>
      )}
    </main>
  )
}
