import { Suspense } from 'react'
import SetSessionClient from './set-session-client'

export const dynamic = 'force-dynamic'

export default function SetSessionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Setting session…</div>}>
      <SetSessionClient />
    </Suspense>
  )
}
