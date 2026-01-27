import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  const { query, sector } = await req.json()

  if (!query || !sector) {
    return NextResponse.json({ error: 'Missing query or sector' }, { status: 400 })
  }

  const snapshot_id = `SNP-${Date.now()}-${nanoid(6)}`
  const intent_id = `INT-${Date.now()}-${nanoid(6)}`

  const now = new Date()
  const expires = new Date(now.getTime() + 30 * 60 * 1000)

  const { data, error } = await supabase
    .from('snapshots')
    .insert([
      {
        snapshot_id,
        intent_id,
        sector,
        generated_at: now.toISOString(),
        expires_at: expires.toISOString(),
        status: 'ACTIVE',
        total_offers: 0,
        results: []
      }
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, snapshot: data[0] })
}
