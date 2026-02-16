import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({
    message: 'Mock ONDC response',
    action: 'ACK',
  })
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Mock ONDC response (GET allowed)',
    action: 'ACK',
  })
}
