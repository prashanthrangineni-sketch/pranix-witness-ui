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
    .limit(1)
    .single();

  return (
    <main style={{ padding: "24px", fontFamily: "system-ui" }}>
      <h1>Cart2Save</h1>

      <p>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr />

      <h2>System Status</h2>
      <p>Mode: Neutral Evidence Layer</p>
      <p>Execution: Human-Gated</p>
      <p>Ledger Authority: Supabase (Read-Only)</p>

      <hr />

      <h2>Latest Ledger Record</h2>

      {error || !data ? (
        <p>No ledger record available for witness display.</p>
      ) : (
        <ul>
          <li><strong>tx_id:</strong> {data.tx_id}</li>
          <li><strong>status:</strong
