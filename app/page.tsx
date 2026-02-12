import SectorGrid from './components/SectorGrid'

export default function HomePage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HERO */}
      <section style={{ marginBottom: '36px' }}>
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

      {/* SECTORS */}
      <SectorGrid />

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
