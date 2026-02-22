export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

/**
 * POST /api/affiliate/amazon/search
 *
 * Proxies requests to the amazon-product-search Supabase Edge Function.
 * Wraps every response in the mandatory Amazon Associates compliance envelope.
 *
 * Modes:
 *   { mode: 'search', keywords: string, search_index?: string }
 *   { mode: 'getItems', item_ids: string[] }   // max 10 ASINs
 *
 * Compliance (Amazon Associates Programme Operating Agreement — India):
 *   - "Prices may vary" disclaimer on every response
 *   - "Last updated" timestamp with every price
 *   - "Ad" disclosure label
 *   - Amazon logo URL included
 *   - ASCI disclosure tooltip text included
 *   - DetailPageURL returned unaltered from Amazon API
 *   - Price data max age: 24 hours (enforced in Edge Function cache)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mode, keywords, item_ids, search_index } = body

    if (!mode) {
      return NextResponse.json(
        { error: 'Missing required field: mode' },
        { status: 400 }
      )
    }
    if (mode === 'search' && !keywords) {
      return NextResponse.json(
        { error: 'mode=search requires keywords' },
        { status: 400 }
      )
    }
    if (mode === 'getItems' && (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0)) {
      return NextResponse.json(
        { error: 'mode=getItems requires item_ids array' },
        { status: 400 }
      )
    }
    if (mode === 'getItems' && item_ids.length > 10) {
      return NextResponse.json(
        { error: 'mode=getItems maximum 10 ASINs per request' },
        { status: 400 }
      )
    }

    const edgeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/amazon-product-search`
    const edgeKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!edgeUrl || !edgeKey) {
      return NextResponse.json(
        { error: 'Amazon affiliate service not configured' },
        { status: 503 }
      )
    }

    const edgeResponse = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${edgeKey}`
      },
      body: JSON.stringify({ mode, keywords, item_ids, search_index })
    })

    if (!edgeResponse.ok) {
      const errText = await edgeResponse.text()
      console.error('Amazon Edge Function error:', edgeResponse.status, errText)
      return NextResponse.json(
        { error: 'Amazon product search failed', detail: errText },
        { status: 502 }
      )
    }

    const result = await edgeResponse.json()

    // Mandatory Amazon Associates compliance envelope on every response
    return NextResponse.json({
      success: true,
      data: result.data ?? null,
      compliance: {
        disclaimer: 'Prices and availability may vary. Check Amazon for current pricing.',
        ad_disclosure: 'Ad',
        asci_disclosure: 'This post contains affiliate links. Cart2Save may earn a commission on qualifying purchases at no extra cost to you.',
        price_policy: 'Prices sourced from Amazon. Valid for up to 24 hours from last_updated timestamp.',
        last_updated: new Date().toISOString(),
        amazon_logo_url: 'https://images-na.ssl-images-amazon.com/images/G/31/associates/amazon-logo.png',
        data_max_age_hours: 24,
        marketplace: 'amazon.in'
      }
    })
  } catch (err: any) {
    console.error('Amazon affiliate route crash:', err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
