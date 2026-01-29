export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('🔥 UPDATE STATUS API HIT')

  return NextResponse.json({
    ok: true,
    message: 'Update status endpoint reached'
  })
}
