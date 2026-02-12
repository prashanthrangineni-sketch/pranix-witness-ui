import type { Metadata } from 'next'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'Cart2Save',
  description: 'Neutral discovery. Best price. Every time.',
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
        {children}

        {/* 🧾 FOOTER */}
        <footer
          style={{
            marginTop: '40px',
            padding: '20px 16px 90px',
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
              Contact: <a href="mailto:support@cart2save.com">support@cart2save.com</a>
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
