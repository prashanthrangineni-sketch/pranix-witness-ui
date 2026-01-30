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

    // 1. Find gig row by either UUID or assignment_id
    const { data: gig, error: fetchError } = await supabase
      .from('gig_assignments')
      .select('id, order_id')
      .or(`id.eq.${assignment_id},assignment_id.eq.${assignment_id}`)
      .single()

    if (fetchError || !gig) {
      return NextResponse.json(
        { error: 'Gig not found' },
        { status: 404 }
      )
    }

    // 2. Update gig status → DELIVERED
    const { error: updateError } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // 3. Update order delivery status → DELIVERED
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
