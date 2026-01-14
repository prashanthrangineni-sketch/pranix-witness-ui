import { supabase } from "@/app/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const txId = params.tx_id;

  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("*")
    .eq("tx_id", txId)
    .single();

  if (error || !data) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Evidence not found</h2>
        <p>Requested ID: {txId}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#000",
        color: "#0ff",
        padding: "40px",
        fontFamily: "monospace",
        minHeight: "100vh",
      }}
    >
      <h1>Evidence Verified</h1>

      <hr />

      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Sector:</strong> {data.sector}</p>
      <p><strong>Item:</strong> {data.item}</p>
      <p><strong>Margin:</strong> {data.margin}%</p>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Timestamp:</strong> {data.created_at}</p>
    </main>
  );
}
