import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { snapshot_id, product_title, price } = body

    if (!snapshot_id || !product_title || !price) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const order_id = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    const merchant_id = '11111111-1111-1111-1111-111111111111'

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
        snapshot_id,
        product_title,
        price,
        merchant_id,
        merchant: 'Local Kirana Store',
        status: 'PENDING',
        payment_status: 'PENDING',
        quantity: 1,
        total_amount: price,
        currency: 'INR'
      })
      .select()
      .single()

    if (error) {
      console.error('Order insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order_id: data.order_id })
  } catch (err: any) {
    console.error('Order API crash:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
