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
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* LEFT: LOGO */}
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
            width={34}
            height={34}
            priority
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.2px',
            }}
          >
            Cart2Save
          </span>
        </div>

        {/* RIGHT: MERCHANT CTA */}
        <button
          onClick={() => router.push('/merchant/signup')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 8px',
          }}
        >
          List prices transparently
        </button>
      </div>
    </header>
  )
}
