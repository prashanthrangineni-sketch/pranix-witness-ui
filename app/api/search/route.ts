export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { snapshot_id: string } }
) {
  const { snapshot_id } = params

  const mockResults = [
    {
      title: 'Basmati Rice 5kg',
      merchant: 'Amazon Fresh',
      price: 749,
      original_price: 999,
      discount: 25,
      delivery: 'Tomorrow',
      trust: 92,
      buy_url: 'https://amazon.in'
    },
    {
      title: 'Basmati Rice 5kg',
      merchant: 'Flipkart Grocery',
      price: 779,
      original_price: 999,
      discount: 22,
      delivery: '2 days',
      trust: 88,
      buy_url: 'https://flipkart.com'
    },
    {
      title: 'Basmati Rice 5kg',
      merchant: 'Local Kirana Store',
      price: 699,
      original_price: 899,
      discount: 22,
      delivery: '30 mins',
      trust: 96,
      buy_url: '#'
    }
  ]

  return NextResponse.json({
    snapshot_id,
    results: mockResults
  })
}
