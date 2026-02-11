'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SetSessionClient() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sid = params.get('sid')

    if (!sid) {
      alert('Missing session id')
      return
    }

    localStorage.setItem('cart2save_session', sid)
    router.replace('/basket')
  }, [params, router])

  return <div style={{ padding: 20 }}>Setting session…</div>
}
