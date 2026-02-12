import SectorGrid from './components/SectorGrid'

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 16px',
      }}
    >
      {/* HERO */}
      <section style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '28px',
            lineHeight: '1.25',
            fontWeight: 800,
            marginBottom: '12px',
          }}
        >
          Best price. Every time.
        </h1>

        <p style={{ fontSize: '16px', color: '#4b5563' }}>
          Compare prices across food, grocery, pharmacy, electronics, fashion,
          mobility, and home services — without ads, rankings, or dark patterns.
        </p>
      </section>

      {/* SECTORS (AMAZON / SWIGGY STYLE ENTRY POINT) */}
      <SectorGrid />

      {/* TRUST STRIP */}
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          margin: '28px 0',
        }}
      >
        <ul
          style={{
            paddingLeft: '18px',
            margin: 0,
            color: '#374151',
            fontSize: '14px',
          }}
        >
          <li>No sponsored results</li>
          <li>No fake discounts</li>
          <li>No seller manipulation</li>
          <li>You choose where to buy</li>
        </ul>
      </section>

      {/* CTA */}
      <section>
        <a
          href="/search"
          style={{
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
            padding: '14px',
            borderRadius: '10px',
            backgroundColor: '#111827',
            color: '#ffffff',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '16px',
          }}
        >
          Start comparing prices
        </a>
      </section>
    </main>
  )
}
