import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { order_id, merchant_id } = await req.json()

    if (!order_id || !merchant_id) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gig_assignments')
      .insert({
        order_id,
        merchant_id,
        status: 'ASSIGNED'
      })
      .select()
      .single()

    if (error) throw error

    await supabase
      .from('orders')
      .update({ delivery_status: 'ASSIGNED' })
      .eq('id', order_id)

    return NextResponse.json({ success: true, gig: data })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
