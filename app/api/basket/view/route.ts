import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  // 1. Read session id from header (preview-safe)
  const sessionId = request.headers.get('x-session-id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing X-Session-ID header' },
      { status: 400 }
    )
  }

  // 2. Get active basket
  const { data: basket } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (!basket) {
    return NextResponse.json(
      { error: 'No active basket' },
      { status: 400 }
    )
  }

  // 3. Get basket items
  const { data: items } = await supabase
    .from('basket_items')
    .select('*')
    .eq('basket_id', basket.id)

  // 4. Group by merchant → product
  const merchants: Record<string, any> = {}

  for (const item of items || []) {
    const merchantId = item.merchant_id

    if (!merchants[merchantId]) {
      merchants[merchantId] = {
        merchant_id: merchantId,
        items: {},
        subtotal: 0
      }
    }

    const productId = item.product_id

    if (!merchants[merchantId].items[productId]) {
      merchants[merchantId].items[productId] = {
        product_id: productId,
        quantity: 0,
        price_at_add: Number(item.price_at_add)
      }
    }

    merchants[merchantId].items[productId].quantity += item.quantity
    merchants[merchantId].subtotal +=
      item.quantity * Number(item.price_at_add)
  }

  // 5. Convert items object → array
  const response = {
    basket_id: basket.id,
    session_id: sessionId,
    merchants: Object.values(merchants).map((m: any) => ({
      merchant_id: m.merchant_id,
      items: Object.values(m.items),
      subtotal: m.subtotal
    }))
  }

  return NextResponse.json(response)
}
