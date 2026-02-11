import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export async function POST() {
  try {
    // 1. Session handling
    const cookieStore = cookies()
    let sessionId = cookieStore.get('cart2save_session')?.value

    if (!sessionId) {
      sessionId = randomUUID()
      cookieStore.set('cart2save_session', sessionId)
    }

    // 2. Check existing active basket
    const { data: existingBasket, error: fetchError } = await supabase
      .from('baskets')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'ACTIVE')
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (existingBasket) {
      return NextResponse.json(existingBasket)
    }

    // 3. Create new basket (ALL REQUIRED FIELDS)
    const { data: newBasket, error: insertError } = await supabase
      .from('baskets')
      .insert({
        session_id: sessionId,
        sector: 'grocery',                // REQUIRED
        status: 'ACTIVE',
        expires_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString()
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(newBasket)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}
