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

// 🔍 SIMPLE KEYWORD → SECTOR MAP (SAFE)
function detectSector(query: string) {
  const q = query.toLowerCase()

  if (q.match(/shirt|dress|jeans|western|fashion|wear/)) return 'fashion'
  if (q.match(/iphone|mobile|laptop|tv|electronics|tablet/)) return 'electronics'
  if (q.match(/biryani|pizza|food|restaurant/)) return 'food'
  if (q.match(/grocery|milk|rice|oil/)) return 'grocery'
  if (q.match(/medicine|tablet|paracetamol|pharmacy/)) return 'pharmacy'
  if (q.match(/cab|taxi|ride|mobility/)) return 'mobility'

  return 'all'
}

function MerchantLogo({ name, slug }: { name: string; slug: string }) {
  const [error, setError] = useState(false)

  if (error) {
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)

    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#111827',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`/brand/logos/${slug}.png`}
      alt={name}
      width={44}
      height={44}
      style={{ borderRadius: 10, objectFit: 'contain' }}
      onError={() => setError(true)}
    />
  )
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState('all')

  useEffect(() => {
    const autoSector = detectSector(query)
    setSelectedSector(autoSector)
    fetchPartners()
  }, [query])

  async function fetchPartners() {
    const { data } = await supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector, affiliate_network')
      .eq('is_active', true)

    if (data) setPartners(data)
    setLoading(false)
  }

  const visiblePartners =
    selectedSector === 'all'
      ? partners
      : partners.filter(
          (p) => p.sector?.toLowerCase() === selectedSector
        )

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.push('/search')}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* SECTOR FILTER */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
        {SECTORS.map((s) => (
          <div
            key={s}
            onClick={() => setSelectedSector(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: s === selectedSector ? '#111827' : '#fff',
              color: s === selectedSector ? '#fff' : '#111827',
              border: '1px solid #e5e7eb',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {loading && <div>Loading platforms…</div>}

      {!loading &&
        visiblePartners.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <MerchantLogo name={p.display_name} slug={p.slug} />
              <div>
                <div style={{ fontWeight: 700 }}>{p.display_name}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  {p.sector}
                </div>
              </div>
            </div>

            <a
              href={`/api/out?m=${p.slug}&q=${encodeURIComponent(query)}`}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#111827',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              View →
            </a>
          </div>
        ))}
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
