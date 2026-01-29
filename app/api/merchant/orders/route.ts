import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

const DEMO_MERCHANT_ID = '11111111-1111-1111-1111-111111111111'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('merchant_id', DEMO_MERCHANT_ID)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data || [] })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
