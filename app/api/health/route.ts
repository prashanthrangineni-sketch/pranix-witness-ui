import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'pranix-witness',
    time: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({
    status: 'ok',
    method: 'POST'
  })
}
