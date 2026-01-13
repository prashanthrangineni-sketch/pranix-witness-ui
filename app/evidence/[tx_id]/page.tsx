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
    <main
      style={{
        padding: 24,
        background: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
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

      <section
        style={{
          background: "#0b0b0b",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3>Integrity Seal</h3>
        <p style={{ opacity: 0.8 }}>
          This record is cryptographically referenced using SHA-256 and stored
          in a read-only ledger. Any modification would invalidate the hash.
        </p>
      </section>

      <hr />

      <a
        href={`data:application/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data, null, 2)
        )}`}
        download={`${data.tx_id}.json`}
        style={{
          display: "inline-block",
          marginTop: "16px",
          padding: "10px 14px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Download Evidence (JSON)
      </a>

      <footer style={{ marginTop: "32px", opacity: 0.4, fontSize: "12px" }}>
        This page displays a neutral, read-only market observation.
      </footer>
    </main>
  );
}
