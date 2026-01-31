export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const assignment_id = new URL(req.url).searchParams.get('assignment_id')

    if (!assignment_id) {
      return NextResponse.json(
        { error: 'Missing assignment_id' },
        { status: 400 }
      )
    }

    // 1️⃣ Fetch gig FIRST (no update yet)
    const { data: gig, error: gigFetchErr } = await supabase
      .from('gig_assignments')
      .select('id, order_id, status')
      .eq('assignment_id', assignment_id)
      .single()

    if (gigFetchErr || !gig) {
      return NextResponse.json(
        { step: 'GIG_NOT_FOUND', assignment_id },
        { status: 404 }
      )
    }

    if (gig.status !== 'PICKED_UP') {
      return NextResponse.json(
        { step: 'INVALID_STATE', current_status: gig.status },
        { status: 409 }
      )
    }

    // 2️⃣ Update gig → DELIVERED
    const { error: gigUpdateErr } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.id)

    if (gigUpdateErr) {
      return NextResponse.json(
        { step: 'GIG_UPDATE_FAILED', error: gigUpdateErr.message },
        { status: 500 }
      )
    }

    // 3️⃣ HARD VERIFY order exists
    const { data: order, error: orderFetchErr } = await supabase
      .from('orders')
      .select('id, delivery_status')
      .eq('id', gig.order_id)
      .single()

    if (orderFetchErr || !order) {
      return NextResponse.json(
        {
          step: 'ORDER_NOT_FOUND',
          order_id: gig.order_id
        },
        { status: 404 }
      )
    }

    // 4️⃣ Update order → DELIVERED
    const { data: updatedOrder, error: orderUpdateErr } = await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.order_id)
      .select('id, delivery_status')
      .single()

    if (orderUpdateErr || !updatedOrder) {
      return NextResponse.json(
        {
          step: 'ORDER_UPDATE_FAILED',
          order_id: gig.order_id
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      assignment_id,
      order_id: updatedOrder.id,
      delivery_status: updatedOrder.delivery_status
    })
  } catch (err: any) {
    return NextResponse.json(
      { step: 'UNHANDLED_ERROR', error: err.message },
      { status: 500 }
    )
  }
}
