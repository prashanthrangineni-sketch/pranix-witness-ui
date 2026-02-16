import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({
    message: 'Mock on_search response (POST)',
    status: 'ACK',
  })
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Mock on_search response (GET allowed)',
    status: 'ACK',
  })
}
