import SectorGrid from './components/SectorGrid'
import FeaturedExamples from './components/FeaturedExamples'

export default function HomePage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HERO */}
      <section style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: '1.2',
            marginBottom: '12px',
          }}
        >
          Best price. Every time.
        </h1>

        <p style={{ fontSize: '17px', color: '#4b5563', marginBottom: '18px' }}>
          Compare real prices across food, grocery, pharmacy, electronics,
          fashion, mobility, and home services — transparently.
        </p>

        <a
          href="/search"
          style={{
            display: 'inline-block',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: '#111827',
            color: '#ffffff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Start comparing prices
        </a>
      </section>

      {/* 🔍 STICKY SEARCH ENTRY (STEP 34) */}
      <section style={{ marginBottom: '32px' }}>
        <a
          href="/search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            textDecoration: 'none',
            color: '#6b7280',
            fontSize: '15px',
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span>Search products, brands, services…</span>
        </a>
      </section>

      {/* SECTORS */}
      <SectorGrid />

      {/* FEATURED EXAMPLES */}
      <FeaturedExamples />

      {/* TRUST STRIP */}
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '18px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <div>✅ No sponsored rankings</div>
          <div>✅ No fake discounts</div>
          <div>✅ No seller manipulation</div>
          <div>✅ You choose where to buy</div>
        </div>
      </section>
    </main>
  )
}
