import { NextResponse } from 'next/server'

type MerchantConfig = {
  base: string
  searchPath?: string
}

const MERCHANTS: Record<string, MerchantConfig> = {
  // Fashion
  tatacliq: {
    base: 'https://www.tatacliq.com/',
    searchPath: 'search?q='
  },
  puma: {
    base: 'https://in.puma.com/in/en/',
    searchPath: 'search?q='
  },
  adidas: {
    base: 'https://www.adidas.co.in/',
    searchPath: 'search?q='
  },

  // Electronics
  samsung: {
    base: 'https://www.samsung.com/in/',
    searchPath: 'search/?searchvalue='
  },
  croma: {
    base: 'https://www.croma.com/',
    searchPath: 'search/?text='
  },

  // Homepage-only (NO keyword injection)
  nykaa: {
    base: 'https://www.nykaa.com/'
  },
  pepperfry: {
    base: 'https://www.pepperfry.com/'
  },
  mamaearth: {
    base: 'https://mamaearth.in/'
  },
  organic_mandya: {
    base: 'https://organicmandya.com/'
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  if (!merchant || !MERCHANTS[merchant]) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  const { base, searchPath } = MERCHANTS[merchant]

  const destination =
    searchPath && query
      ? `${base}${searchPath}${encodeURIComponent(query)}`
      : base

  const cuelinksUrl =
    `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
    encodeURIComponent(destination)

  return NextResponse.redirect(cuelinksUrl, { status: 307 })
}
