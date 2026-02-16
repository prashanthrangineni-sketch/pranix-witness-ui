'use client'

import { Suspense } from 'react'
import ResultsClient from './results-client'

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResultsClient />
    </Suspense>
  )
}
