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
      <p>
        <strong>Transaction ID:</strong> {data.tx_id}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: "green" }}>✅ VERIFIED</span>
      </p>
      <pre
        style={{
          marginTop: "1rem",
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
