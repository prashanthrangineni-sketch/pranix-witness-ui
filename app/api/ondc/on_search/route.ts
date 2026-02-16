import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Mock on_search response',
    status: 'ACK',
  })
}
