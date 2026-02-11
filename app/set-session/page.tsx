'use client'

import { useEffect } from 'react'

export default function SetSessionPage({
  searchParams
}: {
  searchParams: { sid?: string }
}) {
  useEffect(() => {
    if (searchParams?.sid) {
      localStorage.setItem('cart2save_session', searchParams.sid)
      window.location.href = '/basket'
    }
  }, [searchParams])

  return <div style={{ padding: 20 }}>Setting session…</div>
}
