'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => router.push('/search')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          Results for “{query}”
        </h1>
      </div>

      {/* PLACEHOLDER INFO */}
      <div
        style={{
          padding: '16px',
          borderRadius: '14px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '24px',
        }}
      >
        Price comparisons will appear here.
        <br />
        We’ll show results from platforms and merchants where available.
      </div>

      {/* 🔗 AVAILABLE PLATFORMS */}
      <section>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Available on platforms
        </h2>

        {/* Tata CLiQ card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>Tata CLiQ</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Fashion · Affiliate partner
            </div>
          </div>

          <a
            href={`/api/out?m=tatacliq&q=${encodeURIComponent(query)}`}
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
            View on Tata CLiQ →
          </a>
        </div>
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
