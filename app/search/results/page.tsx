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
          marginBottom: '16px',
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

      {/* PLACEHOLDER RESULTS */}
      <div
        style={{
          padding: '20px',
          borderRadius: '14px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '14px',
        }}
      >
        Price comparisons will appear here.
        <br />
        <br />
        We’ll show results from platforms and merchants where available.
      </div>
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
