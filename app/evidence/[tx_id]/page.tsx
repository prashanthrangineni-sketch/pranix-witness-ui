import { supabase } from "../../../lib/supabaseClient";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("*")
    .eq("tx_id", params.tx_id)
    .single();

  if (error || !data) {
    return (
      <main style={{ padding: 24, background: "black", color: "white" }}>
        <h2>Evidence not found</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, background: "black", color: "white" }}>
      <h1>Evidence Record</h1>

      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Sector:</strong> {data.sector}</p>
      <p><strong>Item:</strong> {data.item}</p>
      <p><strong>Margin:</strong> {data.margin_pct}%</p>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Evidence Hash:</strong> {data.sha256_evidence_hash}</p>
      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(data.created_at).toLocaleString()}
      </p>

      <hr />

      <p>
        This page displays a neutral, read-only market observation.
        It does not recommend, promote, or influence purchase decisions.
      </p>
    </main>
  );
}
