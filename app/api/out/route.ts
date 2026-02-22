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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant   = searchParams.get('m')
  const query      = searchParams.get('q') || ''
  const snapshotId = searchParams.get('sid')  || null   // from search results page
  const userId     = searchParams.get('uid')  || null   // logged-in user id
  const sessionId  = searchParams.get('sess') || null   // anonymous session

  if (!merchant) {
    return new NextResponse('Missing merchant', { status: 400 })
  }

  const supabase = getSupabase()

  const { data: partner } = await supabase
    .from('affiliate_partners')
    .select('slug, display_name, sector, affiliate_base_url, affiliate_wrap_type, affiliate_network')
    .eq('slug', merchant)
    .eq('is_active', true)
    .single()

  if (!partner) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  // ── Discovery partners — plain redirect, no tracking ─────
  if (partner.affiliate_wrap_type === 'discovery') {
    return NextResponse.redirect(partner.affiliate_base_url, { status: 307 })
  }

  // Build destination URL (append search query if present)
  const baseUrl     = partner.affiliate_base_url
  const destination = query
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`
    : baseUrl

  // ── Direct (Amazon short links) — redirect, no Cuelinks wrap
  if (partner.affiliate_wrap_type === 'direct') {
    return NextResponse.redirect(destination, { status: 307 })
  }

  // ── Cuelinks wrap — full tracking flow ───────────────────
  const publisherId = process.env.CUELINKS_PUBLISHER_ID
  if (!publisherId) {
    console.error('[/api/out] CUELINKS_PUBLISHER_ID not set')
    return new NextResponse('Affiliate config error', { status: 500 })
  }

  const clickId = generateClickId()

  // Cuelinks URL with uid=clickId so conversion webhook can attribute back
  const cuelinksUrl =
    `https://linksredirect.com/?cid=${publisherId}&source=linkkit` +
    `&url=${encodeURIComponent(destination)}&uid=${encodeURIComponent(clickId)}`

  // Hash IP + UA for fraud signals — no raw PII stored
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'
  const [ipHash, uaHash] = await Promise.all([hashValue(ip), hashValue(ua)])

  // Persist click — fire-and-forget, never blocks the redirect
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
      user_id:           userId  || null,
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
