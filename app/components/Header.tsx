'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* LEFT: LOGO + HOME */}
        <div
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <Image
            src="/brand/cart2save-logo.png"
            alt="Cart2Save"
            width={36}
            height={36}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
            }}
          >
            Cart2Save
          </span>
        </div>

        {/* RIGHT: MERCHANT */}
        <button
          onClick={() => router.push('/merchant/signup')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Are you a merchant?
        </button>
      </div>
    </header>
  )
}
