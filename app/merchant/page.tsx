export default function MerchantLanding() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        Partner with Cart2Save
      </h1>

      <p style={{ fontSize: 16, color: '#4b5563', marginBottom: 20 }}>
        Cart2Save is a neutral price discovery platform. We help users compare
        prices transparently and redirect them to merchants of their choice.
      </p>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Who can join</h3>
        <ul>
          <li>Local retailers & service providers</li>
          <li>Online merchants & brands</li>
          <li>ONDC & platform-integrated sellers</li>
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>How it works</h3>
        <ul>
          <li>Prices are captured as neutral snapshots</li>
          <li>No sponsored rankings or manipulation</li>
          <li>Users choose where to buy</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>What we don’t do</h3>
        <ul>
          <li>No forced discounts</li>
          <li>No exclusive contracts</li>
          <li>No resale of products</li>
        </ul>
      </section>

      <a
        href="/merchant/signup"
        style={{
          display: 'inline-block',
          padding: '14px 18px',
          borderRadius: 12,
          backgroundColor: '#111827',
          color: '#ffffff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Request access →
      </a>
    </main>
  )
}
