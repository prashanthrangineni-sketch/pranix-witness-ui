'use client'

import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
        My Account
      </h1>

      <p style={{ color: '#666', marginBottom: 20 }}>
        Manage your orders, savings, and preferences
      </p>

      {/* Orders */}
      <div
        onClick={() => router.push('/account/orders')}
        style={cardStyle}
      >
        <div>
          <div style={titleStyle}>📦 My Orders</div>
          <div style={subStyle}>
            Track current & past purchases
          </div>
        </div>
        <div style={arrowStyle}>›</div>
      </div>

      {/* Savings */}
      <div style={cardStyle}>
        <div>
          <div style={titleStyle}>💰 Savings & Price Drops</div>
          <div style={subStyle}>
            View how much you saved using Cart2Save
          </div>
        </div>
      </div>

      {/* Trust */}
      <div style={cardStyle}>
        <div>
          <div style={titleStyle}>🛡️ Trust & Neutrality</div>
          <div style={subStyle}>
            How Cart2Save works — no paid rankings
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div style={cardStyle}>
        <div>
          <div style={titleStyle}>⚙️ Preferences & Legal</div>
          <div style={subStyle}>
            Policies, privacy & platform rules
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderRadius: 14,
  background: '#fff',
  marginBottom: 14,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const titleStyle = {
  fontSize: 16,
  fontWeight: 700,
}

const subStyle = {
  fontSize: 13,
  color: '#666',
  marginTop: 4,
}

const arrowStyle = {
  fontSize: 22,
  color: '#999',
}
