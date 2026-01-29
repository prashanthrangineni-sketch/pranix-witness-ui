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

    // 🔹 STEP 1 — Resolve merchant_id from merchants table
    const { data: merchantRow, error: merchantError } = await supabase
      .from('merchants')
      .select('id, business_name')
      .ilike('business_name', `%${merchant}%`)
      .single()

    if (merchantError || !merchantRow) {
      console.error('Merchant lookup failed:', merchantError)
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    const merchant_id = merchantRow.id

    // 🔹 STEP 2 — Create order
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
        merchant_id,
        price,
        quantity: 1,
        total_amount: price,
        currency: 'INR',
        status: 'PENDING',
        payment_status: 'PENDING'
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
