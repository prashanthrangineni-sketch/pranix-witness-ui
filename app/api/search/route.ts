export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id,
        intent_id,
        sector,
        total_offers: 0,
        results: [],
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fire Edge Function to populate results — non-blocking
    // Snapshot is returned to client immediately; results populate async
    const edgeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/search-products`
    const edgeKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (edgeUrl && edgeKey) {
      fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${edgeKey}`
        },
        body: JSON.stringify({ snapshot_id, query, sector })
      }).catch(err => console.error('Edge Function call failed:', err))
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
