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

    // 🔐 THIS IS THE MISSING PIECE
    localStorage.setItem('cart2save_session', sid)

    // Redirect to basket page
    router.replace('/basket')
  }, [params, router])

  return (
    <div style={{ padding: 20 }}>
      Setting session…
    </div>
  )
}
