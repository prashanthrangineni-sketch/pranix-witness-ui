import { supabase } from "../../../lib/supabaseClient";

type PageProps = {
  params: {
    tx_id: string;
  };
};

export default async function EvidencePage({ params }: PageProps) {
  const txId = params?.tx_id;

  if (!txId) {
    return (
      <main style={{ padding: 40, background: "black", color: "white" }}>
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
      <main style={{ padding: 40, background: "black", color: "white" }}>
        <h1>Evidence not found</h1>
        <p>This transaction ID does not resolve to a verified record.</p>
        <p style={{ opacity: 0.6 }}>Requested ID: {txId}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 40,
        background: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
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

      <p style={{ opacity: 0.5, fontSize: 13 }}>
        Ledger Authority: Supabase (Read-Only)
      </p>
    </main>
  );
}
