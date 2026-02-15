'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  affiliate_network: string
}

function Layer({
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
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h2>

      {merchants.map(m => (
        <div
          key={m.id}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 14,
            marginTop: 10,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>{m.display_name}</div>

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

function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()

  const sector = params.get('sector')
  const query = params.get('q') || ''

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) return

    supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, affiliate_network')
      .eq('is_active', true)
      .eq('sector', sector)
      .then(({ data }) => {
        setMerchants(data || [])
        setLoading(false)
      })
  }, [sector])

  const affiliate = merchants.filter(m => m.affiliate_network === 'cuelinks')
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.push('/search')}>← Back</button>

      <h1 style={{ margin: '16px 0' }}>
        Browse {sector?.replace('_', ' ')}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <Layer title="Online platforms" merchants={affiliate} query={query} />
          <Layer title="ONDC sellers" merchants={ondc} query={query} />
          <Layer title="Nearby stores" merchants={local} query={query} />
        </>
      )}
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
