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

    const { data: assignment } = await supabase
      .from('gig_assignments')
      .select('*')
      .eq('assignment_id', assignment_id)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await supabase
      .from('gig_assignments')
      .update({ status: 'DELIVERED', delivered_at: new Date().toISOString() })
      .eq('assignment_id', assignment_id)

    await supabase
      .from('orders')
      .update({ delivery_status: 'DELIVERED' })
      .eq('order_id', assignment.order_id)

    // Trigger settlement
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/settlement/trigger`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: assignment.order_id })
      }
    )

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Delivery failure' },
      { status: 500 }
    )
  }
}
