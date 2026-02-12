import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    /**
     * Expected CueLinks-style payload (flexible):
     * We map safely even if fields evolve
     */

    const order = {
      affiliate_network: 'CUELINKS',
      affiliate_click_id: payload.click_id || payload.sub_id || null,
      affiliate_order_id: payload.order_id || payload.transaction_id || null,

      product_id: payload.product_id || null,
      product_name: payload.product_name || payload.product_title || null,
      product_price: payload.product_price || payload.price || null,
      quantity: payload.quantity || 1,

      order_value: payload.order_value || payload.amount || null,
      commission_value: payload.commission || null,
      currency: payload.currency || 'INR',

      merchant: payload.merchant_name || null,
      merchant_id: payload.merchant_id || null,

      order_status: payload.order_status || 'PLACED',
      payment_status: payload.payment_status || 'UNKNOWN',
      settlement_status: 'PENDING',

      order_source: 'CUELINKS',
      source: 'affiliate',

      snapshot_id: payload.snapshot_id || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('orders')
      .insert(order)

    if (error) {
      console.error('CueLinks insert error:', error)
      return NextResponse.json(
        { error: 'Failed to store order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ status: 'ok' })
  } catch (e) {
    console.error('Webhook error:', e)
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }
}
