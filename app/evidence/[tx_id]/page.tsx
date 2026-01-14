import { supabase } from "../../../lib/supabaseClient";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const { tx_id } = params;

  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select(
      "tx_id, sector, item, status, sha256_evidence_hash, scan_timestamp"
    )
    .eq("tx_id", tx_id)
    .single();

  if (error || !data) {
    return (
      <main style={{ padding: "2rem", background: "black", color: "white" }}>
        <h1>Pranix Sovereign Witness</h1>
        <p>Evidence not found or not yet indexed.</p>
        <p style={{ opacity: 0.6 }}>Transaction ID: {tx_id}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", background: "black", color: "white" }}>
      <h1>Pranix Sovereign Witness</h1>

      <hr style={{ margin: "1rem 0", opacity: 0.2 }} />

      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Sector:</strong> {data.sector}</p>
      <p><strong>Item:</strong> {data.item}</p>
      <p><strong>Status:</strong> {data.status}</p>

      <p style={{ wordBreak: "break-all" }}>
        <strong>Evidence Hash:</strong> {data.sha256_evidence_hash}
      </p>

      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(data.scan_timestamp).toLocaleString()}
      </p>

      <hr style={{ margin: "1.5rem 0", opacity: 0.2 }} />

      <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
        Neutral Evidence Layer · Stateless Witness · V1.1 Institutional
      </p>
    </main>
  );
}
