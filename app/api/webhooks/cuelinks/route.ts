import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

/**
 * CueLinks TEST sometimes hits GET
 * Always return 200
 */
export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    let payload: any = {}

    // CueLinks may send empty body during TEST
    try {
      payload = await req.json()
    } catch {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    /**
     * HARDENED FIELD MAPPING
     * - Never insert NULL into NOT NULL columns
     * - Safe defaults everywhere
     */

    const quantity =
      Number(payload.quantity) > 0 ? Number(payload.quantity) : 1

    const productPrice =
      Number(payload.product_price ?? payload.price) || 0

    const totalAmount =
      Number(payload.order_value ?? payload.amount) ||
      productPrice * quantity ||
      0

    const order = {
      // REQUIRED / HARDENED
      order_id:
        payload.order_id ||
        payload.transaction_id ||
        `CUELINKS_${Date.now()}`,

      merchant_id:
        payload.merchant_id &&
        /^[0-9a-fA-F-]{36}$/.test(payload.merchant_id)
          ? payload.merchant_id
          : '11111111-1111-1111-1111-111111111111',

      total_amount: totalAmount,
      currency: payload.currency || 'INR',

      // AFFILIATE
      affiliate_network: 'CUELINKS',
      affiliate_click_id: payload.click_id || payload.sub_id || null,
      affiliate_order_id:
        payload.order_id || payload.transaction_id || null,

      // PRODUCT
      product_id: payload.product_id || null,
      product_name:
        payload.product_name || payload.product_title || 'Unknown Product',
      product_price: productPrice,
      quantity,

      // COMMISSION
      order_value: totalAmount,
      commission_value: Number(payload.commission) || 0,

      // MERCHANT (TEXT FIELD)
      merchant: payload.merchant_name || 'Unknown Merchant',

      // STATUS
      order_status: payload.order_status || 'CONFIRMED',
      payment_status: payload.payment_status || 'UNKNOWN',
      settlement_status: 'PENDING',
      delivery_status: payload.delivery_status || 'PENDING',

      // SOURCE
      order_source: 'CUELINKS',
      source: 'affiliate',

      snapshot_id: payload.snapshot_id || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('orders').insert(order)

    if (error) {
      console.error('CueLinks insert error:', error)
      // MUST still return 200 or CueLinks will not save webhook
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Webhook fatal error:', e)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
