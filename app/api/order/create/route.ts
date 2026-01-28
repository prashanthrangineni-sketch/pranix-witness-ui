export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { snapshot_id, items } = body

    if (!snapshot_id) {
      return NextResponse.json(
        { error: 'Missing snapshot_id' },
        { status: 400 }
      )
    }

    const order_id = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
        snapshot_id,
        status: 'CREATED',
        total_amount: items?.reduce((a: number, b: any) => a + (b.price || 0), 0) || 0,
        payload: { items }
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order: data })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Error' },
      { status: 500 }
    )
  }
}
