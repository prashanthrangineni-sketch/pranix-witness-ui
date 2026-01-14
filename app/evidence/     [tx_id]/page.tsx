import { notFound } from "next/navigation";

export default function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  if (!params?.tx_id) notFound();

  return (
    <main style={{ padding: 24, background: "black", color: "white" }}>
      <h1>Evidence Verified</h1>

      <p>
        <strong>Transaction ID:</strong>{" "}
        <span style={{ color: "#00e0ff" }}>{params.tx_id}</span>
      </p>

      <p>Status: VERIFIED</p>
      <p>Source: Cart2Save Witness Ledger</p>
    </main>
  );
}
