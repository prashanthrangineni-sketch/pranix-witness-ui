import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { supabase } from '@/lib/supabaseServer'

export async function POST() {
  try {
    // 1. Get or create session
    const cookieStore = cookies()
    let sessionId = cookieStore.get('cart2save_session')?.value

    if (!sessionId) {
      sessionId = randomUUID()
      cookieStore.set('cart2save_session', sessionId)
    }

    // 2. Check for existing active basket
    const { data: existingBasket } = await supabase
      .from('baskets')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'ACTIVE')
      .maybeSingle()

    if (existingBasket) {
      return NextResponse.json(existingBasket)
    }

    // 3. Compute expiry (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // 4. Create new basket (ALL REQUIRED FIELDS)
    const { data, error } = await supabase
      .from('baskets')
      .insert({
        session_id: sessionId,
        sector: 'grocery',
        status: 'ACTIVE',
        expires_at: expiresAt
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
