export default function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  return (
    <main style={{ padding: "24px", background: "black", color: "#00ffff" }}>
      <h1>Cart2Save – Evidence Witness</h1>

      <p>
        <strong>Transaction ID:</strong> {params.tx_id}
      </p>

      <p>Status: Ledger record lookup ready.</p>
    </main>
  );
}
