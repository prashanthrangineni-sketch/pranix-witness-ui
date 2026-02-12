'use client'

export default function BottomNav() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0'
      }}
    >
      <a href="/search">Search</a>
      <a href="/basket">Basket</a>
      <a href="/account">Account</a>
    </div>
  )
}
