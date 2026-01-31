export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const url = new URL(req.url)
  const assignment_id = url.searchParams.get('assignment_id')

  // 🔴 HARD DEBUG – this must show in browser
  if (!assignment_id) {
    return NextResponse.json({
      step: 'DEBUG',
      error: 'assignment_id missing'
    }, { status: 400 })
  }

  // 🔴 DEBUG: echo input
  console.log('DELIVER HIT WITH:', assignment_id)

  // 1️⃣ Update gig
  const { data, error } = await supabase
    .from('gig_assignments')
    .update({
      status: 'DELIVERED',
      delivered_at: new Date().toISOString()
    })
    .eq('assignment_id', assignment_id)
    .select('*')

  // 🔴 DEBUG RESPONSE
  if (error) {
    return NextResponse.json({
      step: 'GIG_UPDATE_ERROR',
      error
    }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      step: 'NO_ROWS_UPDATED',
      assignment_id_received: assignment_id
    }, { status: 404 })
  }

  const gig = data[0]

  // 2️⃣ Update order
  const { error: orderErr } = await supabase
    .from('orders')
    .update({
      delivery_status: 'DELIVERED',
      delivered_at: new Date().toISOString()
    })
    .eq('id', gig.order_id)

  if (orderErr) {
    return NextResponse.json({
      step: 'ORDER_UPDATE_ERROR',
      error: orderErr
    }, { status: 500 })
  }

  return NextResponse.json({
    step: 'SUCCESS',
    assignment_id: gig.assignment_id,
    order_uuid: gig.order_id
  })
}
