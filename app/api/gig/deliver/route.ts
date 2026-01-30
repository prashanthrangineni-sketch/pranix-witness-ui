export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// UUID detector
function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

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

    let gig

    // 🔐 SAFE QUERY BRANCHING
    if (isUUID(assignment_id)) {
      const { data, error } = await supabase
        .from('gig_assignments')
        .select('id, order_id')
        .eq('id', assignment_id)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
      }

      gig = data
    } else {
      const { data, error } = await supabase
        .from('gig_assignments')
        .select('id, order_id')
        .eq('assignment_id', assignment_id)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
      }

      gig = data
    }

    // ✅ Update gig
    await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.id)

    // ✅ Update order
    await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.order_id)

    return NextResponse.json({
      success: true,
      gig_id: gig.id,
      order_id: gig.order_id
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
