export default function FAQsPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
        Help & FAQs
      </h1>

      <section style={{ display: 'grid', gap: '16px' }}>
        <FAQ q="What is Cart2Save?">
          Cart2Save is a neutral price discovery platform. We help you compare
          prices across platforms and merchants before you buy.
        </FAQ>

        <FAQ q="Does Cart2Save sell products?">
          No. We do not sell products, process payments, or deliver orders.
          We redirect you to the platform or merchant of your choice.
        </FAQ>

        <FAQ q="Are results sponsored or ranked?">
          No. We do not run sponsored rankings or paid placements.
          Prices are shown transparently as snapshots.
        </FAQ>

        <FAQ q="Why do prices differ from apps?">
          Prices may change after redirection. Cart2Save shows snapshot prices
          at the time of discovery.
        </FAQ>

        <FAQ q="How does Cart2Save make money?">
          We may earn affiliate fees or platform commissions without affecting
          neutrality or ranking.
        </FAQ>
      </section>
    </main>
  )
}

function FAQ({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: '6px' }}>{q}</div>
      <div style={{ fontSize: '14px', color: '#4b5563' }}>{children}</div>
    </div>
  )
}
