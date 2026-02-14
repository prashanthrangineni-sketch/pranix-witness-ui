'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

/**
 * STEP A: SIMPLE MERCHANT MAP (TEMPORARY, SAFE)
 * This will later move to Supabase — NOT now.
 */
const MERCHANTS = [
  // Fashion
  { slug: 'tatacliq', name: 'Tata CLiQ', sector: 'fashion' },
  { slug: 'nykaa', name: 'Nykaa Fashion', sector: 'fashion' },
  { slug: 'puma', name: 'Puma', sector: 'fashion' },
  { slug: 'adidas', name: 'Adidas', sector: 'fashion' },

  // Electronics
  { slug: 'reliance', name: 'Reliance Digital', sector: 'electronics' },
  { slug: 'croma', name: 'Croma', sector: 'electronics' },
  { slug: 'samsung', name: 'Samsung', sector: 'electronics' },

  // Food & Grocery
  { slug: 'organicmandya', name: 'Organic Mandya', sector: 'grocery' },
  { slug: 'purenutrition', name: 'Pure Nutrition', sector: 'grocery' },
]

function detectSector(query: string) {
  const q = query.toLowerCase()

  if (q.includes('dress') || q.includes('wear') || q.includes('shoe')) return 'fashion'
  if (q.includes('phone') || q.includes('laptop') || q.includes('tv')) return 'electronics'
  if (q.includes('food') || q.includes('rice') || q.includes('organic')) return 'grocery'

  return null
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const sector = detectSector(query)
  const matchingMerchants = sector
    ? MERCHANTS.filter(m => m.sector === sector)
    : []

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/search')}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* EMPTY STATE */}
      {matchingMerchants.length === 0 && (
        <div style={{
          padding: '20px',
          borderRadius: '14px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '14px',
        }}>
          No platforms found yet for this search.
        </div>
      )}

      {/* MERCHANT LIST */}
      {matchingMerchants.length > 0 && (
        <>
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
            Available on platforms
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matchingMerchants.map(m => (
              <div
                key={m.slug}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {m.sector} · Affiliate partner
                  </div>
                </div>

                <a
                  href={`/api/out?m=${m.slug}&q=${encodeURIComponent(query)}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: '#111827',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        </>
      )}
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
