import { NextResponse } from 'next/server'

const MERCHANTS: Record<string, string> = {
  tatacliq: 'https://www.tatacliq.com/',
  nykaa: 'https://www.nykaa.com/',
  adidas: 'https://www.adidas.co.in/',
  puma: 'https://in.puma.com/',
  aldo: 'https://www.aldoshoes.com/in/en/',
  nuawomen: 'https://nuawoman.com/',
  reliance_digital: 'https://www.reliancedigital.in/',
  samsung: 'https://www.samsung.com/in/',
  oneplus: 'https://www.oneplus.in/',
  croma: 'https://www.croma.com/',
  organic_mandya: 'https://organicmandya.com/',
  olivieri_1882: 'https://www.olivieri1882.com/',
  purenutrition: 'https://purenutrition.in/',
  kerala_ayurveda: 'https://www.keralaayurveda.biz/',
  mamaearth: 'https://mamaearth.in/',
  pepperfry: 'https://www.pepperfry.com/'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const merchant = searchParams.get('m')
  const query = searchParams.get('q') || ''

  if (!merchant || !MERCHANTS[merchant]) {
    return new NextResponse('Invalid merchant', { status: 400 })
  }

  const baseUrl = MERCHANTS[merchant]

  const destination =
    query
      ? `${baseUrl}search?q=${encodeURIComponent(query)}`
      : baseUrl

  const cuelinksUrl =
    `https://linksredirect.com/?cid=263419&source=linkkit&url=` +
    encodeURIComponent(destination)

  return NextResponse.redirect(cuelinksUrl, { status: 307 })
}
