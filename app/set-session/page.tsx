'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SetSessionInner() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sid = params.get('sid')

    if (!sid) {
      alert('Missing session id')
      return
    }

    // ✅ Store session in browser
    localStorage.setItem('cart2save_session', sid)

    // ✅ Go to basket after setting
    router.replace('/basket')
  }, [params, router])

  return <div style={{ padding: 20 }}>Setting session…</div>
}

export default function SetSessionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Setting session…</div>}>
      <SetSessionInner />
    </Suspense>
  )
}
