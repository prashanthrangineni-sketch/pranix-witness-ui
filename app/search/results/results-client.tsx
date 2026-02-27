'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

/* -----------------------------
   COMPLIANCE COMPONENTS
------------------------------ */

function AffiliateBadge({ isAffiliate }: { isAffiliate: boolean }) {
  if (!isAffiliate) return null
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 5px',
        fontSize: 10,
        fontWeight: 500,
        background: '#f3f4f6',
        color: '#6b7280',
        border: '1px solid #e5e7eb',
        borderRadius: 4,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        lineHeight: 1,
      }}
    >
      Ad
    </span>
  )
}

function AmazonAssociatesDisclosure({ hasAmazonResults }: { hasAmazonResults: boolean }) {
  if (!hasAmazonResults) return null
  return (
    <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>
      Cart2Save is a participant in the Amazon Associates Programme
      (Associate ID: Pranix949494-21). We earn referral fees on qualifying
      purchases at no extra cost to you.
    </p>
  )
}

/* -----------------------------
   TYPES
------------------------------ */

type Merchant = {
  id: string
  slug: string
  display_name: string
  sector: string
  affiliate_network: 'cuelinks' | 'amazon' | 'ondc' | 'local' | 'discovery'
  affiliate_wrap_type: 'cuelinks' | 'direct' | 'discovery'
  affiliate_base_url: string | null
  website_url: string | null
}

/* -----------------------------
   RESOLUTION LOGIC
------------------------------ */

function resolveByUnit(q: string): string | null {
  if (/\b\d+\s?(mg|ml|tablet|capsule|strip)\b/.test(q)) return 'pharmacy'
  if (/\b\d+\s?(kg|g|gram|litre|liter|packet)\b/.test(q)) return 'grocery'
  return null
}

function hasCookedFoodSignal(q: string): boolean {
  return [
    'curry','gravy','fry','masala','biryani','restaurant','meal','order'
  ].some(w => q.includes(w))
}

function resolveLocalHint(q: string): string | null {
  if (q.includes('iphone') || q.includes('mobile')) return 'electronics'
  if (q.includes('shirt') || q.includes('jeans') || q.includes('shoes')) return 'apparel_fashion'
  if (q.includes('cab') || q.includes('ride') || q.includes('taxi')) return 'mobility'
  if (q.includes('cream') || q.includes('shampoo')) return 'beauty_wellness'
  return null
}

/* -----------------------------
   MERCHANT CARD
------------------------------ */

function MerchantCard({ merchant, query }: { merchant: Merchant; query: string }) {
  const isAffiliate = ['cuelinks', 'amazon'].includes(merchant.affiliate_network)
  const isAmazon = merchant.affiliate_network === 'amazon'
  const isDiscovery = merchant.affiliate_network === 'discovery'

  const url =
    isDiscovery
      ? merchant.affiliate_base_url || merchant.website_url || '#'
      : `/api/out?m=${merchant.slug}&q=${encodeURIComponent(query)}`

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 500 }}>{merchant.display_name}</span>
          <AffiliateBadge isAffiliate={isAffiliate} />
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {isDiscovery ? 'Discovery' : 'Affiliate partner'}
        </div>
      </div>

      <a
        href={url}
        target={isAmazon ? '_blank' : undefined}
        rel={isAmazon ? 'noopener noreferrer sponsored' : undefined}
        style={{
          background: '#111',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 8,
          textDecoration: 'none'
        }}
      >
        {isAmazon ? 'Available on Amazon →' : 'View →'}
      </a>
    </div>
  )
}

/* -----------------------------
   MAIN COMPONENT
------------------------------ */

export default function ResultsClient() {
  const router = useRouter()
  const params = useSearchParams()

  const rawQuery = params.get('q') || ''
  const query = rawQuery.trim().toLowerCase()
  const sectorFromUrl = params.get('sector')

  const [sector, setSector] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [noResults, setNoResults] = useState(false)

  /* -------- SECTOR RESOLUTION WITH REGISTRY VALIDATION -------- */

  useEffect(() => {
    async function resolveSector() {
      setLoading(true)
      setNoResults(false)

      let resolved: string | null = null

      if (sectorFromUrl) {
        resolved = sectorFromUrl
      } else if (query) {
        resolved =
          resolveByUnit(query) ||
          (hasCookedFoodSignal(query) ? 'food' : null)

        if (!resolved) {
          const { data } = await supabase
            .from('sector_keywords')
            .select('keyword, sector')
            .eq('is_active', true)

          const sorted = (data || []).sort((a, b) => b.keyword.length - a.keyword.length)
          const match = sorted.find(k => query.includes(k.keyword.toLowerCase()))
          if (match) resolved = match.sector
        }

        if (!resolved) resolved = resolveLocalHint(query)
      }

      // 🔒 VALIDATE AGAINST CANONICAL REGISTRY
      if (resolved) {
        const { data: registryMatch } = await supabase
          .from('sectors_registry')
          .select('slug')
          .eq('slug', resolved)
          .eq('is_active', true)
          .maybeSingle()

        if (registryMatch) {
          setSector(resolved)
        } else {
          setNoResults(true)
          setSector(null)
        }
      } else {
        setNoResults(true)
        setSector(null)
      }

      setLoading(false)
    }

    resolveSector()
  }, [query, sectorFromUrl])

  /* -------- FETCH MERCHANTS -------- */

  useEffect(() => {
    async function fetchMerchants() {
      if (!sector) {
        setMerchants([])
        return
      }

      const { data } = await supabase
        .from('affiliate_partners')
        .select('*')
        .eq('is_active', true)
        .eq('sector', sector)

      setMerchants(data || [])
    }

    fetchMerchants()
  }, [sector])

  const online = merchants.filter(m =>
    ['cuelinks','amazon','discovery'].includes(m.affiliate_network)
  )
  const ondc = merchants.filter(m => m.affiliate_network === 'ondc')
  const local = merchants.filter(m => m.affiliate_network === 'local')
  const hasAmazonResults = merchants.some(m => m.affiliate_network === 'amazon')

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <button onClick={() => router.back()}>← Back</button>

      <h1 style={{ marginTop: 16 }}>
        {noResults
          ? `No results for "${rawQuery}"`
          : sector
          ? `Showing results for "${rawQuery}" (${sector})`
          : 'Browse platforms'}
      </h1>

      {loading && <div>Loading…</div>}

      {!loading && !noResults && (
        <>
          <h2>Online platforms</h2>
          {online.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}

          <h2>ONDC network</h2>
          {ondc.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}

          <h2>Local merchants</h2>
          {local.map(m => <MerchantCard key={m.id} merchant={m} query={query} />)}

          <AmazonAssociatesDisclosure hasAmazonResults={hasAmazonResults} />
        </>
      )}
    </main>
  )
}
