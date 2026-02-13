export default function HelpPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
        Help & Support
      </h1>

      <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '24px' }}>
        Cart2Save is a neutral discovery platform. We help you compare prices and
        choose where to buy — we don’t sell or deliver products ourselves.
      </p>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          Need help with an order?
        </h2>
        <p style={{ color: '#4b5563' }}>
          Orders are fulfilled by external platforms or merchants. Please contact
          the seller directly using the link you were redirected to.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          Questions about Cart2Save
        </h2>
        <p style={{ color: '#4b5563' }}>
          Email us at{' '}
          <a href="mailto:support@cart2save.com">support@cart2save.com</a>
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          Business & Partnerships
        </h2>
        <p style={{ color: '#4b5563' }}>
          Reach us at{' '}
          <a href="mailto:info@cart2save.com">info@cart2save.com</a>
        </p>
      </section>
    </main>
  )
}
