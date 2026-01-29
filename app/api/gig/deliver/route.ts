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

    // 1️⃣ Mark gig delivered
    const { data: assignment, error: assignErr } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)
      .select('order_id')
      .single()

    if (assignErr || !assignment?.order_id) {
      return NextResponse.json(
        { error: assignErr?.message || 'Assignment not found' },
        { status: 500 }
      )
    }

    const order_id = assignment.order_id

    // 2️⃣ Update order
    await supabase
      .from('orders')
      .update({ delivery_status: 'DELIVERED' })
      .eq('order_id', order_id)

    // 3️⃣ Get deployment-safe base URL
    const baseUrl = new URL(req.url).origin

    // 4️⃣ Trigger settlement
    await fetch(`${baseUrl}/api/settlement/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id })
    })

    return NextResponse.json({
      success: true,
      order_id,
      settlement_triggered: true
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
