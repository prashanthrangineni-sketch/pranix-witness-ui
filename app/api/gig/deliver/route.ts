export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// UUID regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

    // Decide which column to query
    const isUUID = UUID_REGEX.test(assignment_id)

    const query = supabase
      .from('gig_assignments')
      .select('id, order_id')

    const { data: gig, error: fetchError } = isUUID
      ? await query.eq('id', assignment_id).single()
      : await query.eq('assignment_id', assignment_id).single()

    if (fetchError || !gig) {
      return NextResponse.json(
        { error: 'Gig not found' },
        { status: 404 }
      )
    }

    // Update gig status
    const { error: updateGigError } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.id)

    if (updateGigError) {
      return NextResponse.json(
        { error: updateGigError.message },
        { status: 500 }
      )
    }

    // Update order delivery status
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
