'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SetSessionPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sid = params.get('sid')

    if (!sid) {
      alert('Missing session id')
      return
    }

    // ✅ THIS WAS MISSING
    localStorage.setItem('cart2save_session', sid)

    // optional: small delay so browser commits storage
    setTimeout(() => {
      router.replace('/basket')
    }, 300)
  }, [params, router])

  return (
    <div style={{ padding: 20 }}>
      Setting session…
    </div>
  )
}
