export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { query, sector } = body

    if (!query || !sector) {
      return NextResponse.json(
        { error: 'Missing query or sector' },
        { status: 400 }
      )
    }

    const snapshot_id = `SNP-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    const intent_id = `INT-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    // Temporary mock results so UI can render snapshot
    const mockResults = [
      {
        merchant: 'BigBasket',
        price: 312,
        delivery: '2 hrs',
        trust: 92
      },
      {
        merchant: 'Amazon Fresh',
        price: 318,
        delivery: '4 hrs',
        trust: 89
      },
      {
        merchant: 'Flipkart Grocery',
        price: 325,
        delivery: 'Next day',
        trust: 87
      }
    ]

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id,
        intent_id,
        sector,
        status: 'READY',
        total_offers: mockResults.length,
        results: mockResults,
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ snapshot: data })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
