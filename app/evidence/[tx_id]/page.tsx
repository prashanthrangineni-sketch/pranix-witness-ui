export default function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pranix Sovereign Witness</h1>
      <hr />
      <p><strong>Transaction ID:</strong> {params.tx_id}</p>
      <p>Status: Awaiting Data…</p>
    </main>
  );
}
