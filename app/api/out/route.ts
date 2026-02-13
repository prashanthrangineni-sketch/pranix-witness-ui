import { NextResponse } from 'next/server'

const MERCHANTS: Record<string, string> = {
  tatacliq: 'https://www.tatacliq.com/',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const merchantKey = searchParams.get('m')
    const query = searchParams.get('q')

    if (!merchantKey) {
      return NextResponse.json(
        { error: 'Missing merchant parameter' },
        { status: 400 }
      )
    }

    const baseUrl = MERCHANTS[merchantKey]

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Unknown merchant' },
        { status: 400 }
      )
    }

    let redirectUrl = baseUrl

    if (query) {
      redirectUrl =
        baseUrl + 'search?q=' + encodeURIComponent(query)
    }

    return NextResponse.redirect(redirectUrl, 302)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal redirect error' },
      { status: 500 }
    )
  }
}
