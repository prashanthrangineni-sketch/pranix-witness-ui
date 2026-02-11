import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  // 1. Read session ID (preview-safe)
  const sessionId = request.headers.get('x-session-id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing X-Session-ID header' },
      { status: 400 }
    )
  }

  // 2. Find active basket
  const { data: basket } = await supabase
    .from('baskets')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'ACTIVE')
    .single()

  if (!basket) {
    return NextResponse.json(
      { error: 'No active session' },
      { status: 400 }
    )
  }

  // 3. Read request body
  const body = await request.json()
  const { product_uuid, quantity, snapshot_id } = body

  if (!product_uuid || !quantity) {
    return NextResponse.json(
      { error: 'Missing product_uuid or quantity' },
      { status: 400 }
    )
  }

  // 4. Fetch product from PRODUCTS table
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, merchant_id, price')
    .eq('id', product_uuid)
    .single()

  if (!product || productError) {
    return NextResponse.json(
      { error: 'Invalid product_uuid' },
      { status: 400 }
    )
  }

  // 5. Insert into basket_items
  const { data, error } = await supabase
    .from('basket_items')
    .insert({
      basket_id: basket.id,
      product_id: product.id,          // UUID FK ✅
      merchant_id: product.merchant_id,
      quantity,
      price_at_add: product.price,
      snapshot_id: snapshot_id ?? null
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
