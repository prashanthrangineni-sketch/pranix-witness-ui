import { supabase } from "@/app/lib/supabaseClient";

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: { tx_id?: string };
}) {
  const txId = searchParams?.tx_id;

  if (!txId) {
    return (
      <main style={pageStyle}>
        <h1>Evidence not found</h1>
        <p>Requested ID: undefined</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("*")
    .eq("tx_id", txId)
    .single();

  if (error || !data) {
    return (
      <main style={pageStyle}>
        <h1>Evidence not found</h1>
        <p>This transaction ID does not resolve to a verified record.</p>
        <p>Requested ID: {txId}</p>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <h1>Evidence Record</h1>

      <div style={cardStyle}>
        <p>
          <strong>Transaction ID:</strong>{" "}
          <span style={{ color: "#4fd1c5" }}>{data.tx_id}</span>
        </p>

        <p>
          <strong>Sector:</strong> {data.sector}
        </p>

        <p>
          <strong>Item:</strong> {data.item ?? "—"}
        </p>

        <p>
          <strong>Margin:</strong> {data.margin_pct}%
        </p>

        <p style={{ color: "red", fontWeight: "bold" }}>
          Status: EXPOSE
        </p>

        <p style={{ opacity: 0.7, fontSize: "12px" }}>
          Evidence Hash: {data.evidence_hash ?? "—"}
        </p>

        <p style={{ opacity: 0.7, fontSize: "12px" }}>
          Timestamp: {new Date(data.created_at).toLocaleString()}
        </p>
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const pageStyle = {
  padding: "24px",
  background: "black",
  color: "white",
  minHeight: "100vh",
};

const cardStyle = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "12px",
  padding: "16px",
  maxWidth: "600px",
};
