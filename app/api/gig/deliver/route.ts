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

    // 1️⃣ Fetch the order_id from gig_assignments
    const { data: assignment, error: fetchError } = await supabase
      .from('gig_assignments')
      .select('order_id')
      .eq('assignment_id', assignment_id)
      .single()

    if (fetchError || !assignment) {
      return NextResponse.json({ error: 'Invalid assignment_id' }, { status: 400 })
    }

    const order_id = assignment.order_id

    // 2️⃣ Mark gig delivered
    await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)

    // 3️⃣ Mark order delivered + completed
    await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        status: 'COMPLETED'
      })
      .eq('id', order_id)

    return NextResponse.json({
      success: true,
      order_id,
      delivery_status: 'DELIVERED'
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
