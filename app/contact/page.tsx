export default function ContactPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px' }}>
        Contact us
      </h1>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '20px',
          display: 'grid',
          gap: '14px',
          fontSize: '14px',
        }}
      >
        <div>
          <strong>Support:</strong>{' '}
          <a href="mailto:support@cartsave.com">support@cartsave.com</a>
        </div>

        <div>
          <strong>Business:</strong>{' '}
          <a href="mailto:info@cart2save.com">info@cart2save.com</a>
        </div>

        <div>
          <strong>Company:</strong> Pranix AI Labs Private Limited
        </div>

        <div>
          <strong>Location:</strong> Hyderabad, India
        </div>
      </div>
    </main>
  )
}
