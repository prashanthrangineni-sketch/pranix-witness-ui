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

    // 🔹 Phase 1 Mock Offer Engine
    const offers = [
      {
        merchant: 'Amazon Fresh',
        price: 749,
        mrp: 999,
        discount: 25,
        delivery: 'Tomorrow',
        trust: 92,
        verified: true,
        deep_link: '#'
      },
      {
        merchant: 'Flipkart Grocery',
        price: 779,
        mrp: 999,
        discount: 22,
        delivery: '2 days',
        trust: 88,
        verified: true,
        deep_link: '#'
      },
      {
        merchant: 'Local Kirana Store',
        price: 699,
        mrp: 899,
        discount: 22,
        delivery: '30 mins',
        trust: 96,
        verified: true,
        deep_link: '#'
      }
    ]

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id,
        intent_id,
        sector,
        total_offers: offers.length,
        results: offers,
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ snapshot: data })
  } catch (err: any) {
    console.error('API Crash:', err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
