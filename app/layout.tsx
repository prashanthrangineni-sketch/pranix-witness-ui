import type { Metadata } from 'next'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'Cart2Save – Best price. Every time.',
  description:
    'Cart2Save is a neutral price discovery platform. We do not sell products or rank sellers.',
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
          paddingBottom: '72px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#fafafa',
          color: '#111827',
        }}
      >
        {/* 🔷 TOP HEADER */}
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
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/brand/cart2save-logo.png"
                alt="Cart2Save"
                style={{ height: '36px', width: '36px' }}
              />
              <div style={{ fontWeight: 700, fontSize: '18px' }}>
                Cart2Save
              </div>
            </div>

            <a
              href="/merchant/signup"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              Are you a merchant?
            </a>
          </div>
        </header>

        {children}

        {/* 🧾 FOOTER */}
        <footer
          style={{
            marginTop: '48px',
            padding: '24px 16px 90px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>
              Cart2Save
            </div>

            <div style={{ marginBottom: '6px' }}>
              Neutral price discovery platform. We don’t sell products or rank
              sellers.
            </div>

            <div style={{ marginBottom: '6px' }}>
              Contact:{' '}
              <a href="mailto:support@cart2save.com">
                support@cart2save.com
              </a>
            </div>

            <div>
              © {new Date().getFullYear()} Cart2Save · A Pranix AI Labs initiative
            </div>
          </div>
        </footer>

        {/* 🔽 Persistent Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
