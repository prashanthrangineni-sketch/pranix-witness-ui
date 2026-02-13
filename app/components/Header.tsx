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
          gap: '12px',
        }}
      >
        {/* LEFT: LOGO */}
        <div
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Image
            src="/brand/cart2save-logo.png"
            alt="Cart2Save"
            width={32}
            height={32}
            priority
          />
          <span
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.2px',
            }}
          >
            Cart2Save
          </span>
        </div>

        {/* CENTER: SEARCH ENTRY */}
        <div
          onClick={() => router.push('/search')}
          style={{
            flex: 1,
            maxWidth: '320px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            fontSize: '14px',
            color: '#6b7280',
            cursor: 'pointer',
          }}
        >
          🔍 Search products, brands, services
        </div>

        {/* RIGHT: MERCHANT CTA */}
        <button
          onClick={() => router.push('/merchant/signup')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          For merchants
        </button>
      </div>
    </header>
  )
}
