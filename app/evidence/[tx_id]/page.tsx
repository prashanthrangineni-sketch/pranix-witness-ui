export default function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>DEBUG MODE — ROUTE CHECK</h1>
      <hr />
      <p>
        <strong>Raw tx_id from URL:</strong>
      </p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </main>
  );
}
