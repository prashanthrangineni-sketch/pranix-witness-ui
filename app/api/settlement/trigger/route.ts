export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', order_id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.settlement_triggered) {
      return NextResponse.json({ success: true, message: 'Already settled' })
    }

    const total = Number(order.price || order.total_amount || 0)

    const merchant_payout = total * 0.9
    const gig_payout = total * 0.05
    const platform_fee = total * 0.05

    const { error: insertError } = await supabase
      .from('settlement_ledger')
      .insert({
        order_id,
        merchant_id: order.merchant_id,
        gig_worker_id: null,
        order_amount: total,
        merchant_payout,
        gig_payout,
        platform_fee,
        settlement_status: 'COMPLETED'
      })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    await supabase
      .from('orders')
      .update({
        settlement_status: 'COMPLETED',
        settlement_triggered: true
      })
      .eq('order_id', order_id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Settlement failure' },
      { status: 500 }
    )
  }
}
