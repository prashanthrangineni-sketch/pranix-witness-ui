export default function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  return (
    <main style={{ padding: "24px" }}>
      <h1>Evidence Record</h1>
      <p><strong>Transaction ID:</strong> {params.tx_id}</p>
    </main>
  );
}
