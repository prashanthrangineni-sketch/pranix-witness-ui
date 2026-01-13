import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("tx_id, status, scan_timestamp")
    .order("scan_timestamp", { ascending: false })
    .limit(1);

  return (
    <main style={{ padding: "24px", fontFamily: "monospace" }}>
      <h1>Cart2Save — Evidence Witness</h1>

      <p>
        Cart2Save is a neutral commerce intelligence platform.
        It does not recommend, promote, or optimise prices.
      </p>

      <hr />

      <h2>Latest Ledger Record</h2>

      {error && <p>Error reading ledger.</p>}

      {data && data.length > 0 ? (
        <pre>{JSON.stringify(data[0], null, 2)}</pre>
      ) : (
        <p>No ledger records available.</p>
      )}

      <hr />

      <p>
        System Mode: Neutral Evidence Layer<br />
        Execution: Human-Gated<br />
        Ledger Authority: Supabase (Read-Only)
      </p>
    </main>
  );
}
