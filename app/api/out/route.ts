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

  const baseUrl = partner.affiliate_base_url
  const destination = query
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`
    : baseUrl

  // CueLinks flow
  if (partner.affiliate_network === 'cuelinks') {
    const cuelinksUrl =
      `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
      encodeURIComponent(destination)

    return NextResponse.redirect(cuelinksUrl, { status: 307 })
  }

  // Direct (Amazon etc.)
  return NextResponse.redirect(destination, { status: 307 })
}
