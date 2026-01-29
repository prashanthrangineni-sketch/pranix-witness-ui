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
    const order_id = searchParams.get('order_id')

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const assignment_id = `GIG-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`

    const { error } = await supabase
      .from('gig_assignments')
      .insert({
        assignment_id,
        order_id,
        status: 'ASSIGNED'
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase
      .from('orders')
      .update({ delivery_status: 'ASSIGNED' })
      .eq('order_id', order_id)

    return NextResponse.json({ success: true, assignment_id })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
