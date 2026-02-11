// lib/session.ts
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export function getSessionId() {
  const cookieStore = cookies()
  let sessionId = cookieStore.get('cart2save_session')?.value

  if (!sessionId) {
    sessionId = randomUUID()
    cookieStore.set('cart2save_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
  }

  return sessionId
}
