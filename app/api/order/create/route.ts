import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { snapshot_id, product_title, merchant, price } = body

    if (!snapshot_id || !product_title || !merchant || !price) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const order_id = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
        snapshot_id,
        product_title,
        merchant,
        price,
        total_amount: price,   // 🔥 REQUIRED FIX
        status: 'CREATED'
      })
      .select()
      .single()

    if (error) {
      console.error('Order insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ order_id: data.order_id })
  } catch (err: any) {
    console.error('Order API crash:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
