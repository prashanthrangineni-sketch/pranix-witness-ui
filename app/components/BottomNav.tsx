'use client'

import { usePathname, useRouter } from 'next/navigation'

const tabs = [
  { label: 'Search', path: '/search', icon: '🔍' },
  { label: 'Basket', path: '/basket', icon: '🧺' },
  { label: 'Account', path: '/account', icon: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px 14px',
        background: '#ffffff',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#f3f4f6',
          borderRadius: 16,
          padding: 6,
        }}
      >
        {tabs.map((tab) => {
          const active = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              style={{
                flex: 1,
                border: 'none',
                background: active ? '#000' : 'transparent',
                color: active ? '#fff' : '#555',
                borderRadius: 12,
                padding: '10px 0',
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
