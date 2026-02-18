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

  // DISCOVERY ONLY → NO REDIRECT
  if (partner.affiliate_wrap_type === 'discovery') {
    return new NextResponse('Discovery only', { status: 204 })
  }

  let destination = partner.affiliate_base_url

  if (query) {
    destination =
      `${destination}${destination.includes('?') ? '&' : '?'}q=` +
      encodeURIComponent(query)
  }

  // CueLinks
  if (partner.affiliate_wrap_type === 'cuelinks') {
    destination =
      `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
      encodeURIComponent(destination)
  }

  return NextResponse.redirect(destination, { status: 307 })
}
