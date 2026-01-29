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
    .update({ status: 'DELIVERED', delivered_at: new Date() })
    .eq('id', gig_id)

  await supabase
    .from('orders')
    .update({ delivery_status: 'DELIVERED' })
    .eq('id', order_id)

  return NextResponse.json({ success: true })
}
