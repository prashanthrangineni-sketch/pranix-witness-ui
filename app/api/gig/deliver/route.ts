export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const assignment_id = searchParams.get('assignment_id')

    if (!assignment_id) {
      return NextResponse.json({ error: 'Missing assignment_id' }, { status: 400 })
    }

    // 1️⃣ Mark gig as DELIVERED
    const { data: gig, error: gigErr } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)
      .select('id, order_id')
      .single()

    if (gigErr || !gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // 2️⃣ Update order using UUID PRIMARY KEY (THIS IS THE FIX)
    const { error: orderErr } = await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.order_id)

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order_uuid: gig.order_id,
      delivery_status: 'DELIVERED'
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
