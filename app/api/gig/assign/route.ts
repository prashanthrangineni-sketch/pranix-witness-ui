export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    // order_id here MUST be orders.id (UUID)
    const order_id = new URL(req.url).searchParams.get('order_id')

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const assignment_id = `GIG-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`

    const { error: insertErr } = await supabase
      .from('gig_assignments')
      .insert({
        assignment_id,
        order_id, // UUID → orders.id
        status: 'ASSIGNED'
      })

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    // ✅ UPDATE orders USING UUID PRIMARY KEY
    const { error: orderErr } = await supabase
      .from('orders')
      .update({ delivery_status: 'ASSIGNED' })
      .eq('id', order_id)

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      assignment_id
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
