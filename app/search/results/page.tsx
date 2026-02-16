'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
}

export default function SearchResultsPage() {
  const router = useRouter()
  const params = useSearchParams()

  const sector =
    params.get('sector') ||
    (() => {
      const q = params.get('q')?.toLowerCase() || ''
      if (q.includes('iphone') || q.includes('mobile')) return 'electronics'
      if (q.includes('shirt') || q.includes('shoes')) return 'apparel_fashion'
      if (q.includes('grocery')) return 'grocery'
      if (q.includes('pharmacy') || q.includes('medicine')) return 'pharmacy'
      return null
    })()

  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sector) {
      setLoading(false)
      return
    }

    supabase
      .from('affiliate_partners')
      .select('id, slug, display_name, sector')
      .eq('is_active', true)
      .eq('sector', sector)
      .eq('affiliate_network', 'cuelinks')
      .then(({ data }) => {
        setMerchants(data || [])
        setLoading(false)
      })
  }, [sector])

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.push('/search')}>← Back</button>

      <h1 style={{ margin: '16px 0' }}>
        {sector ? `Browse ${sector.replace('_', ' ')}` : 'No results'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading &&
        merchants.map(m => (
          <div
            key={m.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{m.display_name}</div>
            <a
              href={`/api/out?m=${m.slug}`}
              style={{
                background: '#111',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              View prices →
            </a>
          </div>
        ))}

      {!loading && merchants.length === 0 && (
        <div>No platforms available</div>
      )}
    </main>
  )
}
