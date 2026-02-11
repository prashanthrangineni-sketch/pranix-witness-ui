import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  // 1. Read session from header (preview-safe)
  const sessionId = request.headers.get('x-session-id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing X-Session-ID header' },
      { status: 400 }
    )
  }

  // 2. Find active basket
  const { data: basket } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (!basket) {
    return NextResponse.json(
      { error: 'No active session' },
      { status: 400 }
    )
  }

  // 3. Read request body
  const body = await request.json()
  const { product_id, quantity, price_snapshot } = body

  if (!product_id || !quantity || price_snapshot === undefined) {
    return NextResponse.json(
      { error: 'Missing product_id, quantity, or price_snapshot' },
      { status: 400 }
    )
  }

  // 4. Insert basket item (IMPORTANT FIX)
  const { data, error } = await supabase
    .from('basket_items')
    .insert({
      basket_id: basket.id,
      product_id,
      quantity,
      price_at_add: price_snapshot, // ✅ REQUIRED COLUMN
      price_snapshot
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
}
