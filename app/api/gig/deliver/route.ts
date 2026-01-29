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
      return NextResponse.json(
        { error: 'Missing assignment_id' },
        { status: 400 }
      )
    }

    // 1. Mark gig as delivered
    const { data: gig, error: gigError } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)
      .select('order_id')
      .single()

    if (gigError || !gig) {
      return NextResponse.json(
        { error: gigError?.message || 'Gig not found' },
        { status: 500 }
      )
    }

    const order_id = gig.order_id

    // 2. Update order delivery status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        status: 'COMPLETED'
      })
      .eq('order_id', order_id)

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order_id,
      final_status: 'DELIVERED'
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
