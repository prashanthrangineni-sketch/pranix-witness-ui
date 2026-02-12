import type { Metadata } from 'next'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'Cart2Save',
  description: 'Neutral price discovery and basket platform'
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
        {children}

        {/* Persistent Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
