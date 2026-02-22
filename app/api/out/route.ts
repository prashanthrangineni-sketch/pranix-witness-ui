import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role required — affiliate_clicks has RLS: service_role only
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Compact unique click ID: CL-{base36 timestamp}-{random 5 chars}
function generateClickId(): string {
  const ts   = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CL-${ts}-${rand}`
}

// Hash a string (first 8 bytes of SHA-256) — no PII stored
async function hashValue(value: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  )
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Builds destination URL for a partner.
 * - Cuelinks: uses ?q= (default)
 * - Amazon direct: uses ?k= + injects Associates tag server-side
 * Tag is NEVER stored in DB — always injected here.
 */
function buildDestination(
  baseUrl: string,
  query: string,
  searchParamKey: string,
  associatesTag?: string
): string {
  let url = query
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${searchParamKey}=${encodeURIComponent(query)}`
    : baseUrl

  if (associatesTag) {
    url += `${url.includes('?') ? '&' : '?'}tag=${associatesTag}`
  }

  return url
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant   = searchParams.get('m')
  const query      = searchParams.get('q') || ''
  const snapshotId = searchParams.get('sid')  || null
  const userId     = searchParams.get('uid')  || null
  const sessionId  = searchParams.get('sess') || null

  if (!merchant) {
    return new NextResponse('Missing merchant', { status: 400 })
  }

  const supabase = getSupabase()

  const { data: partner } = await supabase
    .from('affiliate_partners')
    .select('slug, display_name, sector, affiliate_base_url, affiliate_wrap_type, affiliate_network, search_param_key')
    .eq('slug', merchant)
    .eq('is_active', true)
    .single()

  if (!partner) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  // ── Discovery — plain redirect, no tracking ───────────────────────────────
  if (partner.affiliate_wrap_type === 'discovery') {
    return NextResponse.redirect(partner.affiliate_base_url, { status: 307 })
  }

  // ── Direct (Amazon) — tag injection ───────────────────────────────────────
  if (partner.affiliate_wrap_type === 'direct') {
    const associatesTag = process.env.AMAZON_ASSOCIATES_TAG
    if (!associatesTag) {
      console.error('[/api/out] AMAZON_ASSOCIATES_TAG not set — blocking untagged Amazon redirect')
      return new NextResponse('Amazon affiliate config error', { status: 500 })
    }

    const searchKey   = partner.search_param_key || 'k'
    const destination = buildDestination(partner.affiliate_base_url, query, searchKey, associatesTag)
    return NextResponse.redirect(destination, { status: 307 })
  }

  // ── Cuelinks wrap — full tracking flow ────────────────────────────────────
  const publisherId = process.env.CUELINKS_PUBLISHER_ID
  if (!publisherId) {
    console.error('[/api/out] CUELINKS_PUBLISHER_ID not set')
    return new NextResponse('Affiliate config error', { status: 500 })
  }

  const searchKey   = partner.search_param_key || 'q'
  const destination = buildDestination(partner.affiliate_base_url, query, searchKey)

  const clickId = generateClickId()

  const cuelinksUrl =
    `https://linksredirect.com/?cid=${publisherId}&source=linkkit` +
    `&url=${encodeURIComponent(destination)}&uid=${encodeURIComponent(clickId)}`

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'
  const [ipHash, uaHash] = await Promise.all([hashValue(ip), hashValue(ua)])

  supabase
    .from('affiliate_clicks')
    .insert({
      click_id:          clickId,
      merchant_slug:     partner.slug,
      merchant_name:     partner.display_name,
      affiliate_network: partner.affiliate_network || 'cuelinks',
      destination_url:   destination,
      affiliate_url:     cuelinksUrl,
      sector:            partner.sector,
      user_id:           userId     || null,
      snapshot_id:       snapshotId || null,
      session_id:        sessionId  || null,
      ip_hash:           ipHash,
      user_agent_hash:   uaHash,
      converted:         false,
    })
    .then(({ error }) => {
      if (error) console.error('[/api/out] affiliate_clicks insert failed:', error.message)
    })

  return NextResponse.redirect(cuelinksUrl, { status: 307 })
}
