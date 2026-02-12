export default function MerchantPage() {
  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 16px',
      }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
        Partner with Cart2Save
      </h1>

      <p style={{ marginBottom: '16px', color: '#374151' }}>
        Cart2Save is a neutral price discovery platform. We help customers
        discover the best available prices across platforms — without paid
        rankings or ads.
      </p>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
          Who can partner?
        </h2>

        <ul style={{ paddingLeft: '18px', color: '#4b5563' }}>
          <li>Local merchants & retailers</li>
          <li>ONDC-enabled sellers</li>
          <li>Brands & authorized distributors</li>
          <li>Service providers (home, mobility, etc.)</li>
        </ul>
      </div>

      <div
        style={{
          background: '#f9fafb',
          border: '1px dashed #d1d5db',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
          How to get started
        </h2>

        <p style={{ color: '#374151', marginBottom: '8px' }}>
          Merchant onboarding is currently invite-only.
        </p>

        <p style={{ color: '#374151' }}>
          Write to{' '}
          <a href="mailto:merchant@cart2save.com">
            merchant@cart2save.com
          </a>{' '}
          with your business details.
        </p>
      </div>
    </main>
  )
}
