import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const merchant_id = searchParams.get('merchant_id')

    if (!merchant_id) {
      return NextResponse.json(
        { error: 'Missing merchant_id' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('merchant_id', merchant_id)
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
