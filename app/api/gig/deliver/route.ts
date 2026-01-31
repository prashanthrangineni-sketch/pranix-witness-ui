export async function GET(req: Request) {
  try {
    const assignment_id = new URL(req.url).searchParams.get('assignment_id')

    if (!assignment_id) {
      return NextResponse.json({ error: 'Missing assignment_id' }, { status: 400 })
    }

    const { data: gig, error } = await supabase
      .from('gig_assignments')
      .update({
        status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id) // TEXT → TEXT
      .select('order_id')
      .single()

    if (error || !gig) {
      return NextResponse.json(
        { step: 'NO_ROWS_UPDATED', assignment_id_received: assignment_id },
        { status: 404 }
      )
    }

    await supabase
      .from('orders')
      .update({
        delivery_status: 'DELIVERED',
        delivered_at: new Date().toISOString()
      })
      .eq('id', gig.order_id) // ✅ UUID → UUID (NO CAST ERROR)

    return NextResponse.json({
      success: true,
      delivery_status: 'DELIVERED'
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
