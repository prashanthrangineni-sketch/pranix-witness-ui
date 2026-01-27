import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { query, sector } = await req.json()

    const snapshot_id = `SNP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const { data, error } = await supabase
      .from('snapshots')
      .insert({
        snapshot_id,
        sector,
        total_offers: 0,
        status: 'ACTIVE'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ snapshot: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
