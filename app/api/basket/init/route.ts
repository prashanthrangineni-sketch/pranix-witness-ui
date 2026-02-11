import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { getSessionId } from '@/lib/session'

export async function POST() {
  const session_id = getSessionId()

  const { data: basket } = await supabaseServer
    .from('baskets')
    .select('*')
    .eq('session_id', session_id)
    .maybeSingle()

  if (basket) {
    return NextResponse.json({ basket })
  }

  const { data, error } = await supabaseServer
    .from('baskets')
    .insert({ session_id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ basket: data })
}
