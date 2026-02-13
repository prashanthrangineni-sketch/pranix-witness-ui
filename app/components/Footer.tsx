export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        marginTop: '40px',
        padding: '24px 16px 100px',
        fontSize: '13px',
        color: '#6b7280',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <a href="/help">Help</a>
          <a href="/faqs">FAQs</a>
          <a href="/contact">Contact</a>
          <a href="/neutrality">Neutrality</a>
          <a href="/legal/terms">Terms</a>
          <a href="/legal/privacy">Privacy</a>
          <a href="/legal/affiliate">Affiliate Disclosure</a>
        </div>

        <div style={{ lineHeight: '1.6' }}>
          <strong>Cart2Save</strong><br />
          A neutral price discovery platform.<br />
          Operated by Pranix AI Labs Private Limited<br />
          Hyderabad, India
        </div>

        <div style={{ marginTop: '8px' }}>
          Support:{' '}
          <a href="mailto:support@cart2save.com">support@cart2save.com</a>
          <br />
          Business:{' '}
          <a href="mailto:info@cart2save.com">info@cart2save.com</a>
        </div>

        <div style={{ marginTop: '8px' }}>
          © {new Date().getFullYear()} Cart2Save
        </div>
      </div>
    </footer>
  )
}
