import { NextResponse } from 'next/server'

const MERCHANT_LINKS: Record<string, string> = {
  tatacliq:
    'https://linksredirect.com/?cid=263419&source=linkkit&url=https%3A%2F%2Fwww.tatacliq.com%2F',
  // future:
  // amazon: 'CUELINKS_URL',
  // flipkart: 'CUELINKS_URL',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('merchant')
  const keyword = searchParams.get('kw') // for logging only (future)

  if (!merchant || !MERCHANT_LINKS[merchant]) {
    return NextResponse.redirect('/', { status: 302 })
  }

  // 🔒 Neutral logging (optional, safe to extend later)
  console.log('Outbound click', {
    merchant,
    keyword,
    time: new Date().toISOString(),
  })

  return NextResponse.redirect(MERCHANT_LINKS[merchant], { status: 302 })
}
