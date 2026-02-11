'use client'

// 👇 THIS LINE FIXES THE BUILD ERROR
export const dynamic = 'force-dynamic'

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

    // Store session for basket page
    localStorage.setItem('cart2save_session', sid)

    // Go to basket
    router.replace('/basket')
  }, [params, router])

  return (
    <div style={{ padding: 20 }}>
      Setting session…
    </div>
  )
}
``
