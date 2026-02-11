import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { product_id, quantity = 1, price_snapshot = null } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      )
    }

    // 1. Get session_id from cookie
    const cookieStore = cookies()
    const sessionId = cookieStore.get('cart2save_session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 400 }
      )
    }

    // 2. Get active basket
    const { data: basket, error: basketError } = await supabase
      .from('baskets')
      .select('id')
      .eq('session_id', sessionId)
      .eq('status', 'ACTIVE')
      .single()

    if (basketError || !basket) {
      return NextResponse.json(
        { error: 'Active basket not found' },
        { status: 404 }
      )
    }

    // 3. Insert item into basket_items
    const { data: item, error: insertError } = await supabase
      .from('basket_items')
      .insert({
        basket_id: basket.id,
        product_id,
        quantity,
        price_snapshot
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(item)
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}
