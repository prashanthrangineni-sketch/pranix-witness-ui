import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const { query } = await req.json()

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('snapshots')
    .insert([
      {
        search_query: query,
        source: 'frontend'
      }
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, snapshot: data[0] })
}
