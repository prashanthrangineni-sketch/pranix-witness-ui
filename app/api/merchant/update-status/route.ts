export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, status, merchant_id } = body

    if (!id || !status || !merchant_id) {
      return NextResponse.json(
        { error: 'Missing id or status or merchant_id' },
        { status: 400 }
      )
    }

    // 1️⃣ Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        delivery_status:
          status === 'READY_FOR_PICKUP' ? 'READY_FOR_PICKUP' : status
      })
      .eq('id', id)

    if (error) {
      console.error('Order update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2️⃣ Auto assign gig when READY
    if (status === 'READY_FOR_PICKUP') {
      const { error: gigError } = await supabase
        .from('gig_assignments')
        .insert({
          order_id: id,
          merchant_id,
          status: 'ASSIGNED'
        })

      if (gigError) {
        console.error('Gig assign error:', gigError)
        return NextResponse.json(
          { error: gigError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Update API crash:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
