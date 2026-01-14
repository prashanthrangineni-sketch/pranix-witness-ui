// app/evidence/[tx_id]/page.tsx

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ tx_id: string }>;
}) {
  const { tx_id } = await params;

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Pranix Sovereign Witness</h1>
      <hr />
      <section style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
        <p><strong>Transaction ID:</strong> {tx_id}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span style={{ color: 'orange' }}>Awaiting Data...</span>
        </p>
      </section>
      <footer style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
        Neutral Evidence Layer | V1.1 Institutional
      </footer>
    </main>
  );
}
