'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Partner = {
  id: string
  slug: string
  display_name: string
  sector: string
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPartners()
  }, [])

  async function loadPartners() {
    const { data } = await supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector')
      .eq('is_active', true)

    if (data) setPartners(data)
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/search')}
          style={{ background: 'none', border: 'none', fontSize: '20px' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* INFO */}
      <div
        style={{
          padding: '14px',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '24px',
        }}
      >
        Choose where you want to buy. Prices and checkout happen on the merchant site.
      </div>

      {loading && <div>Loading platforms…</div>}

      {/* ONLINE BRANDS */}
      <Section
        title="Online brands"
        subtitle="Trusted online platforms"
        partners={partners}
        query={query}
      />

      {/* ONDC */}
      <StaticSection
        title="ONDC sellers"
        subtitle="Government-backed open commerce"
      />

      {/* LOCAL */}
      <StaticSection
        title="Nearby stores"
        subtitle="Shops near you"
      />
    </main>
  )
}

function Section({
  title,
  subtitle,
  partners,
  query,
}: {
  title: string
  subtitle: string
  partners: Partner[]
  query: string
}) {
  if (partners.length === 0) return null

  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h2>
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
        {subtitle}
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {partners.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{p.display_name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {p.sector} · Online brand
              </div>
            </div>

            <a
              href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#111827',
                color: '#ffffff',
                fontSize: '14px',
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

function StaticSection({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <section style={{ marginBottom: '28px', opacity: 0.6 }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h2>
      <div style={{ fontSize: '13px', color: '#6b7280' }}>{subtitle}</div>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#9ca3af' }}>
        Coming soon
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
