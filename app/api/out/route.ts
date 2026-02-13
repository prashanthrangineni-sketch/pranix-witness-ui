import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  // ✅ Simple merchant map (NO database yet)
  if (merchant === 'tatacliq') {
    // Base Tata CLiQ URL
    const destination =
      query
        ? `https://www.tatacliq.com/search?q=${encodeURIComponent(query)}`
        : 'https://www.tatacliq.com/'

    // 🔗 Wrap with CueLinks
    const cuelinksUrl =
      `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
      encodeURIComponent(destination)

    return NextResponse.redirect(cuelinksUrl, { status: 307 })
  }

  // ❌ Fallback (unknown merchant)
  return new NextResponse('Invalid merchant', { status: 400 })
}
