import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  // 1. Read session from header
  const sessionId = request.headers.get('x-session-id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing X-Session-ID header' },
      { status: 400 }
    )
  }

  // 2. Find active basket
  const { data: basket, error: basketError } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (basketError || !basket) {
    return NextResponse.json(
      { error: 'No active basket found' },
      { status: 400 }
    )
  }

  // 3. Fetch basket items
  const { data: items, error: itemsError } = await supabase
    .from('basket_items')
    .select('*')
    .eq('basket_id', basket.id)

  if (itemsError) {
    return NextResponse.json(
      { error: itemsError.message },
      { status: 500 }
    )
  }

  // 4. Group items by merchant_id
  const grouped: Record<string, any> = {}

  for (const item of items || []) {
    const merchantId = item.merchant_id

    if (!grouped[merchantId]) {
      grouped[merchantId] = {
        merchant_id: merchantId,
        items: [],
        subtotal: 0
      }
    }

    grouped[merchantId].items.push({
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_add: item.price_at_add
    })

    grouped[merchantId].subtotal +=
      Number(item.price_at_add) * Number(item.quantity)
  }

  // 5. Final response
  return NextResponse.json({
    basket_id: basket.id,
    session_id: sessionId,
    merchants: Object.values(grouped)
  })
}
