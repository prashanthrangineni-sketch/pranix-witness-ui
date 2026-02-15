'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'affiliate' | 'ondc' | 'local'
}

const SECTOR_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  apparel_fashion: 'Apparel & Fashion',
  grocery: 'Grocery',
  pharmacy: 'Pharmacy',
  home_services: 'Home Services',
  mobility: 'Mobility',
  food: 'Food',
  beauty_wellness: 'Beauty & Wellness',
}

function MerchantLayer({
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
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        {title}
      </h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {merchants.map(m => (
          <div
            key={m.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{m.display_name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {title}
              </div>
            </div>

            <a
              href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#111827',
                color: '#fff',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View prices →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()

  const query = params.get('q') || ''
  const sector = params.get('sector') || ''

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) {
      setLoading(false)
      return
    }

    async function load() {
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

  const affiliate = merchants.filter(m => m.affiliate_network === 'affiliate')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button
        onClick={() => router.push('/search')}
        style={{ background: 'none', border: 'none', fontSize: 20 }}
      >
        ←
      </button>

      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Browse {SECTOR_LABELS[sector] || 'Platforms'}
      </h1>

      {loading && <div>Loading platforms…</div>}

      {!loading && merchants.length === 0 && (
        <div>No platforms available yet. Coming soon.</div>
      )}

      {!loading && (
        <>
          <MerchantLayer title="Online platforms" merchants={affiliate} query={query} />
          <MerchantLayer title="ONDC sellers" merchants={ondc} query={query} />
          <MerchantLayer title="Nearby stores" merchants={local} query={query} />
        </>
      )}
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
