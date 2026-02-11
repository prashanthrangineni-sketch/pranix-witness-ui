import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export async function POST() {
  // 1. Get or create session_id
  const cookieStore = cookies()
  let sessionId = cookieStore.get('cart2save_session')?.value

  if (!sessionId) {
    sessionId = randomUUID()
    cookieStore.set('cart2save_session', sessionId)
  }

  // 2. Check if basket already exists
  const { data: existingBasket } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (existingBasket) {
    return NextResponse.json(existingBasket)
  }

  // 3. Create new basket (IMPORTANT: sector is REQUIRED)
  const { data: newBasket, error } = await supabase
    .from('baskets')
    .insert({
      session_id: sessionId,
      sector: 'grocery',   // 👈 REQUIRED, TEMP DEFAULT
      status: 'ACTIVE'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: errorRemember: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(newBasket)
}
