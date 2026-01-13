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
    .maybeSingle();

  if (error || !data) {
    return (
      <main
        style={{
          padding: 24,
          background: "black",
          color: "white",
          minHeight: "100vh",
        }}
      >
        <h2>Evidence not found</h2>
        <p style={{ opacity: 0.6 }}>
          This transaction ID does not resolve to a single verified record.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 24,
        background: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Evidence Record</h1>

      <p>
        <strong>Transaction ID:</strong> {data.tx_id}
      </p>
      <p>
        <strong>Sector:</strong> {data.sector}
      </p>
      <p>
        <strong>Item:</strong> {data.item}
      </p>
      <p>
        <strong>Margin:</strong> {data.margin_pct}%
      </p>
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <p>
        <strong>Evidence Hash:</strong> {data.sha256_evidence_hash}
      </p>
      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(data.created_at).toLocaleString()}
      </p>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <p style={{ opacity: 0.6, fontSize: "14px" }}>
        This page displays a neutral, read-only market observation.
        It does not recommend, promote, or influence purchase decisions.
      </p>
    </main>
  );
}
