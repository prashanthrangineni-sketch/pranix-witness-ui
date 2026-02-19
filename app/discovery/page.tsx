export default function DiscoveryPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Discover platforms
      </h1>

      <p style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>
        Cart2Save shows discovery links for popular platforms.
        Prices, availability, and checkout happen directly on the partner platform.
      </p>

      <div style={{ marginTop: 24 }}>
        <ul style={{ lineHeight: '28px' }}>
          <li>Food & grocery delivery</li>
          <li>Pharmacy & medicines</li>
          <li>Home services</li>
          <li>Mobility & transport</li>
        </ul>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: '#9ca3af' }}>
        This page is informational. No affiliate tracking applies.
      </p>
    </main>
  );
}
