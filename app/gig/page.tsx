export default function GigLanding() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        Apply as a delivery partner
      </h1>

      <p style={{ fontSize: 16, color: '#4b5563', marginBottom: 20 }}>
        Cart2Save enables independent delivery partners to participate in
        merchant fulfilment on a task-based, opt-in basis.
      </p>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Participation model</h3>
        <ul>
          <li>No employment relationship</li>
          <li>Task-based delivery assignments</li>
          <li>Bring your own vehicle</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Requirements</h3>
        <ul>
          <li>Valid mobile number</li>
          <li>KYC verification</li>
          <li>City-based availability</li>
        </ul>
      </section>

      <a
        href="/gig/signup"
        style={{
          display: 'inline-block',
          padding: '14px 18px',
          borderRadius: 12,
          backgroundColor: '#0f766e',
          color: '#ffffff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Apply now →
      </a>
    </main>
  )
}
