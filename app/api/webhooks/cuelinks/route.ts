import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

/**
 * CueLinks TEST calls this with GET
 * We must always return 200
 */
export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    let payload: any = {}

    // Safely parse JSON only if present
    try {
      payload = await req.json()
    } catch {
      // CueLinks may send empty body during TEST
      return NextResponse.json({ success: true }, { status: 200 })
    }

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

    const { error } = await supabase.from('orders').insert(order)

    if (error) {
      console.error('CueLinks insert error:', error)
      // IMPORTANT: still return 200 so CueLinks can SAVE
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Webhook error:', e)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
