'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const sectors = [
    { name: 'Food', icon: '🍔', route: '/search?sector=food' },
    { name: 'Grocery', icon: '🛒', route: '/search?sector=grocery' },
    { name: 'Pharmacy', icon: '💊', route: '/search?sector=pharmacy' },
    { name: 'Electronics', icon: '📱', route: '/search?sector=electronics' },
    { name: 'Fashion', icon: '👕', route: '/search?sector=fashion' },
    { name: 'Home Services', icon: '🛠️', route: '/search?sector=services' },
    { name: 'Mobility', icon: '🚕', route: '/search?sector=mobility' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* HEADER */}
      <header
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #eee',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '-0.5px',
          }}
        >
          Cart2Save
        </div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
          Neutral discovery • Best price • Every time
        </div>
      </header>

      {/* HERO SEARCH */}
      <div style={{ padding: 20 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>
            Search across all platforms
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#f3f4f6',
              padding: '12px 14px',
              borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              placeholder="Search products, food, services…"
              onFocus={() => router.push('/search')}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 15,
                flex: 1,
              }}
            />
            <span style={{ fontSize: 18, opacity: 0.6 }}>🎤</span>
            <span style={{ fontSize: 18, opacity: 0.6 }}>📸</span>
          </div>
        </div>
      </div>

      {/* SECTORS */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
          Explore categories
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          {sectors.map((s) => (
            <div
              key={s.name}
              onClick={() => router.push(s.route)}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '18px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{ padding: 20, marginTop: 24 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            Why Cart2Save?
          </div>
          <ul
            style={{
              marginTop: 10,
              paddingLeft: 18,
              fontSize: 13,
              color: '#555',
              lineHeight: 1.6,
            }}
          >
            <li>No paid rankings or ads</li>
            <li>Compare prices across platforms</li>
            <li>Redirect-only — we don’t sell your data</li>
            <li>ONDC & affiliate powered</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
