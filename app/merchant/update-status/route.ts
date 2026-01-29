import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const { order_id, status } = await req.json()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', order_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
