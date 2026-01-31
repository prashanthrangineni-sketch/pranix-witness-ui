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

    const { data, error } = await supabase
      .from('gig_assignments')
      .update({
        status: 'PICKED_UP',
        picked_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)
      .select('order_id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'Assignment not found' },
        { status: 404 }
      )
    }

    // ✅ UPDATE orders USING UUID PRIMARY KEY
    const { error: orderErr } = await supabase
      .from('orders')
      .update({ delivery_status: 'PICKED_UP' })
      .eq('id', data.order_id)

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
