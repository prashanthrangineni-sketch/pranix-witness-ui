import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { supabase } from '@/lib/supabaseServer'

export async function POST() {
  try {
    // Step 1: Get or create session
    const cookieStore = cookies()
    let sessionId = cookieStore.get('cart2save_session')?.value

    if (!sessionId) {
      sessionId = randomUUID()
      cookieStore.set('cart2save_session', sessionId)
    }

    // Step 2: Check existing active basket
    const { data: existingBasket } = await supabase
      .from('baskets')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'ACTIVE')
      .maybeSingle()

    if (existingBasket) {
      return NextResponse.json(existingBasket)
    }

    // Step 3: Create new basket (IMPORTANT: sector INCLUDED)
    const { data, error } = await supabase
      .from('baskets')
      .insert({
        session_id: sessionId,
        sector: 'grocery',
        status: 'ACTIVE'
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
