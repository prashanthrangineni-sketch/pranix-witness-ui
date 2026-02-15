'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Partner = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: string
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    const { data } = await supabase
      .from('affiliate_partners')
      .select('*')
      .eq('is_active', true)

    setPartners(data || [])
    setLoading(false)
  }

  const online = partners.filter(p => p.affiliate_network === 'cuelinks')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Results for “{query}”
      </h1>

      {loading && <div>Loading platforms…</div>}

      {/* ONLINE STORES */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>🛍 Online stores</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          Brand websites & large marketplaces
        </p>

        {online.map(p => (
          <div
            key={p.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fff'
            }}
          >
            <div>
              <strong>{p.display_name}</strong>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{p.sector}</div>
            </div>

            <a
              href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#111827',
                color: '#fff',
                fontSize: 14,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              View prices →
            </a>
          </div>
        ))}
      </section>

      {/* ONDC */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>🌐 ONDC sellers</h2>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Government-backed open commerce (coming soon)
        </p>
      </section>

      {/* LOCAL */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>📍 Nearby stores</h2>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Shops near you (coming soon)
        </p>
      </section>
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
