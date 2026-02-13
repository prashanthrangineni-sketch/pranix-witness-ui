import type { Metadata } from 'next'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'Cart2Save – Best price. Every time.',
  description: 'Compare prices across platforms before you buy',
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#fafafa',
          color: '#111827',
        }}
      >
        {/* 🔝 HEADER */}
        <Header />

        {/* 🔽 PAGE CONTENT */}
        <main style={{ paddingBottom: '90px' }}>
          {children}
        </main>

        {/* 🔽 FOOTER */}
        <Footer />

        {/* 🔽 BOTTOM NAV */}
        <BottomNav />
      </body>
    </html>
  )
}
