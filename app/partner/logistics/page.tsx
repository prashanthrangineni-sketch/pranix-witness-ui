export default function LogisticsPartnerPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        Logistics partnerships
      </h1>

      <p style={{ fontSize: 16, color: '#4b5563', marginBottom: 20 }}>
        Cart2Save collaborates with independent logistics and fleet providers
        to enable merchant fulfilment where local delivery networks are required.
      </p>

      <section style={{ marginBottom: 20 }}>
        <ul>
          <li>Non-exclusive partnerships</li>
          <li>Bring-your-own-fleet model</li>
          <li>Task-level integrations</li>
          <li>No guaranteed volumes</li>
        </ul>
      </section>

      <p style={{ marginBottom: 24 }}>
        If you operate a logistics or delivery network and would like to
        explore collaboration, reach out to us.
      </p>

      <a
        href="mailto:info@cart2save.com"
        style={{
          display: 'inline-block',
          padding: '14px 18px',
          borderRadius: 12,
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Contact partnerships →
      </a>
    </main>
  )
}
