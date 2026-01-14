import { supabase } from "@/lib/supabaseClient";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const { tx_id } = params;

  const { data, error } = await supabase
    .from("evidence_records")
    .select("*")
    .eq("tx_id", tx_id)
    .single();

  if (error || !data) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Pranix Sovereign Witness</h1>
        <p>Status: ❌ Evidence Not Found</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pranix Sovereign Witness</h1>
      <hr />
      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Status:</strong> {data.status}</p>
      <pre style={{ background: "#111", color: "#0f0", padding: "1rem" }}>
        {JSON.stringify(data.payload, null, 2)}
      </pre>
      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
        Neutral Evidence Layer | Institutional Grade
      </footer>
    </main>
  );
}
