import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  if (!merchant) {
    return new NextResponse('Missing merchant', { status: 400 })
  }

  const { data: partner } = await supabase
    .from('affiliate_partners')
    .select('*')
    .eq('slug', merchant)
    .eq('is_active', true)
    .single()

  if (!partner) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  // Discovery → no redirect tracking
  if (partner.affiliate_wrap_type === 'discovery') {
    return NextResponse.redirect(partner.affiliate_base_url, { status: 307 })
  }

  // Affiliate / Direct
  const baseUrl = partner.affiliate_base_url
  const destination = query
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`
    : baseUrl

  if (partner.affiliate_wrap_type === 'cuelinks') {
    const publisherId = process.env.CUELINKS_PUBLISHER_ID
    if (!publisherId) {
      console.error('CUELINKS_PUBLISHER_ID env var not set')
      return new NextResponse('Affiliate config error', { status: 500 })
    }
    const cuelinksUrl =
      `https://linksredirect.com/?cid=${publisherId}&source=linkkit&url=` +
      encodeURIComponent(destination)

    return NextResponse.redirect(cuelinksUrl, { status: 307 })
  }

  // Direct (Amazon etc.)
  return NextResponse.redirect(destination, { status: 307 })
}
