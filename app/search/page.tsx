'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

function resolveSector(query: string) {
  const q = query.toLowerCase()

  if (['iphone', 'samsung', 'mobile', 'laptop', 'tv'].some(k => q.includes(k)))
    return 'electronics'

  if (['shoes', 'dress', 'shirt', 'jeans', 'fashion', 'running'].some(k => q.includes(k)))
    return 'apparel_fashion'

  if (['medicine', 'tablet', 'pharmacy', 'paracetamol'].some(k => q.includes(k)))
    return 'pharmacy'

  if (['milk', 'rice', 'vegetables', 'grocery'].some(k => q.includes(k)))
    return 'grocery'

  if (['cab', 'taxi', 'bike', 'ride'].some(k => q.includes(k)))
    return 'mobility'

  if (['salon', 'spa', 'beauty', 'wellness'].some(k => q.includes(k)))
    return 'beauty_wellness'

  if (['repair', 'cleaning', 'plumber', 'electrician'].some(k => q.includes(k)))
    return 'home_services'

  return null
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function submitSearch() {
    if (!query.trim()) return

    const sector = resolveSector(query)

    if (!sector) {
      alert('Please try a more specific search')
      return
    }

    router.push(
      `/search/results?sector=${sector}&q=${encodeURIComponent(query)}`
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submitSearch()}
        placeholder="Search products, brands, services"
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          fontSize: 16,
        }}
      />
    </div>
  )
}
