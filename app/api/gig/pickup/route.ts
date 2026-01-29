import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { gig_id, order_id } = await req.json()

  await supabase
    .from('gig_assignments')
    .update({ status: 'PICKED_UP', picked_at: new Date() })
    .eq('id', gig_id)

  await supabase
    .from('orders')
    .update({ delivery_status: 'IN_TRANSIT' })
    .eq('id', order_id)

  return NextResponse.json({ success: true })
}
