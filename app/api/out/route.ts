import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  if (!merchant) {
    return new NextResponse('Missing merchant', { status: 400 })
  }

  // 🔍 Fetch affiliate partner config
  const { data, error } = await supabase
    .from('affiliate_partners')
    .select('*')
    .eq('slug', merchant)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  // 🎯 Build destination URL
  const destination = query
    ? `${data.affiliate_base_url}search?q=${encodeURIComponent(query)}`
    : data.affiliate_base_url

  // 🔗 Wrap with CueLinks
  const cuelinksUrl =
    `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
    encodeURIComponent(destination)

  return NextResponse.redirect(cuelinksUrl, { status: 307 })
}
