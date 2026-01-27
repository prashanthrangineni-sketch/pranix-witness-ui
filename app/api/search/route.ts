export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, sector } = body

    if (!query || !sector) {
      return NextResponse.json(
        { error: 'Missing query or sector' },
        { status: 400 }
      )
    }

    const snapshotId = `SNP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const intentId = `INT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id: snapshotId,
        intent_id: intentId,
        user_id: null,
        sector,
        total_offers: 0,
        status: 'ACTIVE',
        results: [],
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
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
