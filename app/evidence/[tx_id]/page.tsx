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
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return (
      <main style={{ padding: 24, background: "black", color: "white" }}>
        <h2>Evidence not found</h2>
        <p style={{ opacity: 0.6 }}>
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
      <h1>Evidence Chain</h1>

      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        Transaction ID: <strong>{params.tx_id}</strong>
      </p>

      {data.map((row, index) => (
        <div
          key={row.created_at + index}
          style={{
            background: "#0b0b0b",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p style={{ fontWeight: 600, color: "#4fd1c5" }}>
            Observation #{index + 1}
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
                borderRadius: "6px",
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
                borderRadius: "6px",
                fontWeight: 700,
              }}
            >
              {row.status}
            </span>
          </p>

          <p style={{ opacity: 0.85 }}>
            Evidence Hash: {row.sha256_evidence_hash}
          </p>

          <p style={{ opacity: 0.6, fontSize: "14px" }}>
            Timestamp: {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      <hr style={{ marginTop: 32, opacity: 0.2 }} />

      <p style={{ opacity: 0.4, fontSize: "13px" }}>
        This page displays a neutral, read-only evidence chain. It does not
        recommend, promote, or influence purchase decisions.
      </p>
    </main>
  );
}
