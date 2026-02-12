import type { Metadata } from 'next'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'Cart2Save',
  description: 'Neutral price discovery and basket platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          paddingBottom: '72px', // space for bottom nav
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#fafafa',
        }}
      >
        {/* 🔹 TOP HEADER */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <img
              src="/brand/cart2save-logo.png"
              alt="Cart2Save"
              style={{ height: '36px', width: 'auto' }}
            />
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Cart2Save
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                }}
              >
                Best price. Every time.
              </div>
            </div>
          </a>
        </header>

        {/* 🔹 PAGE CONTENT */}
        {children}

        {/* 🔹 PERSISTENT BOTTOM NAV */}
        <BottomNav />
      </body>
    </html>
  )
}
