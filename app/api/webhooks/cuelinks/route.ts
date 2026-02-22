import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    let payload: any = {}
    try {
      payload = await req.json()
    } catch {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const quantity = Number(payload.quantity) > 0 ? Number(payload.quantity) : 1
    const productPrice = Number(payload.product_price ?? payload.price) || 0
    const totalAmount =
      Number(payload.order_value ?? payload.amount) ||
      productPrice * quantity ||
      0

    const order = {
      order_id: payload.order_id || payload.transaction_id || `CUELINKS_${Date.now()}`,
      merchant_id:
        payload.merchant_id && /^[0-9a-fA-F-]{36}$/.test(payload.merchant_id)
          ? payload.merchant_id
          : '11111111-1111-1111-1111-111111111111',
      total_amount: totalAmount,
      currency: payload.currency || 'INR',
      affiliate_network: 'CUELINKS',
      affiliate_click_id: payload.click_id || payload.sub_id || null,
      affiliate_order_id: payload.order_id || payload.transaction_id || null,
      product_id: payload.product_id || null,
      product_name: payload.product_name || payload.product_title || 'Unknown Product',
      product_price: productPrice,
      quantity,
      order_value: totalAmount,
      commission_value: Number(payload.commission) || 0,
      merchant: payload.merchant_name || 'Unknown Merchant',
      order_status: payload.order_status || 'CONFIRMED',
      payment_status: payload.payment_status || 'UNKNOWN',
      settlement_status: 'PENDING',
      delivery_status: payload.delivery_status || 'PENDING',
      order_source: 'CUELINKS',
      source: 'affiliate',
      snapshot_id: payload.snapshot_id || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('orders').insert(order)
    if (error) {
      console.error('CueLinks insert error:', error)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Phase 3: Attribution — match webhook back to affiliate_clicks
    const subId = payload.sub_id || payload.uid || payload.click_id || null
    if (subId) {
      const { error: clickErr } = await supabase
        .from('affiliate_clicks')
        .update({
          converted: true,
          conversion_value: payload.order_value ?? payload.amount ?? null,
          commission_amount: payload.commission ?? null,
          webhook_received_at: new Date().toISOString(),
        })
        .eq('click_id', subId)
        .eq('converted', false)
      if (clickErr) {
        console.error('[webhook/cuelinks] attribution failed:', clickErr.message)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Webhook fatal error:', e)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}