export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: Request,
  { params }: { params: { snapshot_id: string } }
) {
  const { snapshot_id } = params

  const { data: snapshot, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('snapshot_id', snapshot_id)
    .single()

  if (error || !snapshot) {
    return NextResponse.json(
      { error: 'Snapshot not found' },
      { status: 404 }
    )
  }

  // If results already exist → return them
  if (snapshot.results && snapshot.results.length > 0) {
    return NextResponse.json(snapshot)
  }

  // 🔥 MOCK OFFER ENGINE (DEMO MODE)
  const basePrice = Math.floor(Math.random() * 200) + 600

  const offers = [
    {
      title: 'India Gate Basmati Rice 5kg',
      merchant: 'Amazon Fresh',
      price: basePrice - 40,
      original_price: basePrice + 80,
      discount: 25,
      delivery: 'Tomorrow',
      trust: 92,
      buy_url: '#'
    },
    {
      title: 'Daawat Basmati Rice 5kg',
      merchant: 'Flipkart Grocery',
      price: basePrice - 10,
      original_price: basePrice + 60,
      discount: 22,
      delivery: '2 days',
      trust: 88,
      buy_url: '#'
    },
    {
      title: 'Local Kirana Premium Rice 5kg',
      merchant: 'Local Kirana Store',
      price: basePrice - 80,
      original_price: basePrice + 20,
      discount: 30,
      delivery: '30 mins',
      trust: 96,
      buy_url: '#'
    }
  ]

  await supabase
    .from('snapshots')
    .update({
      results: offers,
      total_offers: offers.length
    })
    .eq('snapshot_id', snapshot_id)

  return NextResponse.json({
    ...snapshot,
    results: offers,
    total_offers: offers.length
  })
}
