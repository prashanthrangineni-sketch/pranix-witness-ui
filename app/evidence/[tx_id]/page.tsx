import { supabase } from "../../../lib/supabaseClient";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const normalizedTxId = params.tx_id.trim();

  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("*")
    .eq("tx_id", normalizedTxId)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return (
      <main
        style={{
          padding: 24,
          background: "black",
          color: "white",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h2>Evidence not found</h2>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          This transaction ID does not resolve to a verified record.
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
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 16 }}>Evidence Chain</h1>

      {data.map((row) => (
        <div
          key={row.id}
          style={{
            background: "#0b0b0b",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p style={{ color: "#4fd1c5", fontWeight: 600 }}>
            Transaction ID: {row.tx_id}
          </p>

          <p>Sector: {row.sector}</p>
          <p>Item: {row.item}</p>

          <p>
            Margin:{" "}
            <span
              style={{
                background: "#f59e0b",
                color: "black",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              {row.margin_pct}%
            </span>
          </p>

          <p>
            Status:{" "}
            <span
              style={{
                background: "#dc2626",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              {row.status}
            </span>
          </p>

          <p style={{ opacity: 0.85 }}>
            Evidence Hash: {row.sha256_evidence_hash}
          </p>

          <p style={{ opacity: 0.6, fontSize: 14 }}>
            Timestamp: {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <p style={{ opacity: 0.5, fontSize: 13 }}>
        This page displays a neutral, read-only market observation.
        It does not recommend, promote, or influence purchase decisions.
      </p>
    </main>
  );
}
