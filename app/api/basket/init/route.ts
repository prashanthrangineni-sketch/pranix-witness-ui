import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  // 1. Try to read session from header (PREVIEW MODE)
  const sessionFromHeader = request.headers.get('x-session-id')
  let sessionId = sessionFromHeader || randomUUID()

  // 2. Check if active basket exists
  const { data: existing } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (existing) {
    return NextResponse.json({
      ...existing,
      session_id: sessionId
    })
  }

  // 3. Create new basket
  const { data, error } = await supabase
    .from('baskets')
    .insert({
      session_id: sessionId,
      status: 'ACTIVE',
      sector: 'grocery',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ...data,
    session_id: sessionId
  })
}
