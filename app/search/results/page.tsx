'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Partner = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: string
}

const SECTORS = [
  'all',
  'fashion',
  'electronics',
  'food',
  'grocery',
  'pharmacy',
  'mobility',
  'home services',
]

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = (searchParams.get('q') || '').toLowerCase()

  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ AUTO-DETECT SECTOR FROM QUERY
  const detectedSector = SECTORS.includes(query) ? query : 'all'
  const [selectedSector, setSelectedSector] = useState(detectedSector)

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    const { data, error } = await supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector, affiliate_network')
      .eq('is_active', true)

    if (!error && data) {
      setPartners(data)
    }
    setLoading(false)
  }

  // ✅ APPLY SECTOR FILTER
  const visiblePartners =
    selectedSector === 'all'
      ? partners
      : partners.filter(
          (p) => p.sector?.toLowerCase() === selectedSector
        )

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* SECTOR FILTER */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
        {SECTORS.map((sector) => {
          const active = sector === selectedSector
          return (
            <div
              key={sector}
              onClick={() => setSelectedSector(sector)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: active ? '1px solid #111827' : '1px solid #e5e7eb',
                backgroundColor: active ? '#111827' : '#ffffff',
                color: active ? '#ffffff' : '#111827',
                textTransform: 'capitalize',
              }}
            >
              {sector}
            </div>
          )
        })}
      </div>

      {/* INFO */}
      <div style={{ padding: '14px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        Showing platforms where this item may be available.
        Prices and checkout happen on the merchant site.
      </div>

      {/* RESULTS */}
      {loading && <div>Loading platforms…</div>}

      {!loading && visiblePartners.length === 0 && (
        <div>No platforms available for this sector.</div>
      )}

      <section style={{ display: 'grid', gap: '12px' }}>
        {visiblePartners.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{p.display_name}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {p.sector} · {p.affiliate_network}
              </div>
            </div>

            <a
              href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#111827',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View prices →
            </a>
          </div>
        ))}
      </section>
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading results…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
