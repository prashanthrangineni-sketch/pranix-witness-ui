'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/search/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <input
        placeholder="Search products, brands, services"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
        }}
      />
    </main>
  )
}
