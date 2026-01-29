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
    const { order_id, status } = body

    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'Missing order_id or status' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', order_id)

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json(
      { error: 'Server failure' },
      { status: 500 }
    )
  }
}
