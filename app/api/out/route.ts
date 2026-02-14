import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  if (!merchant) {
    return new NextResponse('Missing merchant', { status: 400 })
  }

  /* -------------------------------------------------
     1️⃣ TRY SUPABASE (affiliate_partners)
  -------------------------------------------------- */
  const { data: partner, error } = await supabase
    .from('affiliate_partners')
    .select('*')
    .eq('slug', merchant)
    .eq('is_active', true)
    .single()

  if (partner && !error) {
    const baseUrl = partner.affiliate_base_url
    const destination = query
      ? `${baseUrl}search?q=${encodeURIComponent(query)}`
      : baseUrl

    // Wrap with CueLinks
    const cuelinksUrl =
      `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
      encodeURIComponent(destination)

    return NextResponse.redirect(cuelinksUrl, { status: 307 })
  }

  /* -------------------------------------------------
     2️⃣ FALLBACK — EXISTING TATA CLIQ LOGIC
     (kept intentionally for safety)
  -------------------------------------------------- */
  if (merchant === 'tatacliq') {
    const destination = query
      ? `https://www.tatacliq.com/search?q=${encodeURIComponent(query)}`
      : 'https://www.tatacliq.com/'

    const cuelinksUrl =
      `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
      encodeURIComponent(destination)

    return NextResponse.redirect(cuelinksUrl, { status: 307 })
  }

  /* -------------------------------------------------
     3️⃣ UNKNOWN MERCHANT
  -------------------------------------------------- */
  return new NextResponse('Invalid merchant', { status: 400 })
}
