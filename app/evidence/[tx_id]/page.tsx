import { supabase } from "@/app/lib/supabaseClient";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id?: string };
}) {
  const txId = params?.tx_id;

  if (!txId) {
    return (
      <main style={{ padding: "24px", background: "black", color: "white" }}>
        <h1>Evidence not found</h1>
        <p>This transaction ID does not resolve to a verified record.</p>
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
      <main style={{ padding: "24px", background: "black", color: "white" }}>
        <h1>Evidence not found</h1>
        <p>This transaction ID does not resolve to a verified record.</p>
        <p>Requested ID: {txId}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px", background: "black", color: "white" }}>
      <h1>Evidence Record</h1>

      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Sector:</strong> {data.sector}</p>
      <p><strong>Item:</strong> {data.item}</p>
      <p><strong>Margin:</strong> {data.margin_pct}%</p>
      <p><strong>Status:</strong> EXPOSE</p>
      <p><strong>Evidence Hash:</strong> {data.evidence_hash}</p>
      <p><strong>Timestamp:</strong> {data.created_at}</p>

      <hr />
      <p style={{ opacity: 0.6 }}>
        Ledger Authority: Supabase (Read-Only)
      </p>
    </main>
  );
}
