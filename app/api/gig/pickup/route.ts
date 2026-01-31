export async function GET(req: Request) {
  try {
    const assignment_id = new URL(req.url).searchParams.get('assignment_id')

    if (!assignment_id) {
      return NextResponse.json({ error: 'Missing assignment_id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gig_assignments')
      .update({
        status: 'PICKED_UP',
        picked_at: new Date().toISOString()
      })
      .eq('assignment_id', assignment_id)
      .select('order_id')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await supabase
      .from('orders')
      .update({ delivery_status: 'PICKED_UP' })
      .eq('id', data.order_id) // ✅ UUID

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
