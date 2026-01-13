"use client";

import { supabase } from "../lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("tx_id, sector, created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  return (
    <main style={{ padding: "24px", color: "white", background: "black" }}>
      <h1>Cart2Save</h1>

      <p>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <p>
        The system displays verified market evidence across food, groceries,
        mobility, fashion, pharmacy, electronics, and home services.
      </p>

      <hr />

      <h2>System Status</h2>
      <ul>
        <li>Mode: Neutral Evidence Layer</li>
        <li>Execution: Human-Gated</li>
        <li>Ledger Authority: Supabase (Read-Only)</li>
      </ul>

      <hr />

      <h2>Latest Ledger Record</h2>

      {error && <p>Error reading ledger.</p>}

      {data && data.length > 0 && (
        <div>
          <p><strong>Transaction ID:</strong> {data[0].tx_id}</p>
          <p><strong>Sector:</strong> {data[0].sector}</p>
          <p><strong>Timestamp:</strong> {data[0].created_at}</p>
        </div>
      )}

      {!data && <p>No ledger records found.</p>}
    </main>
  );
}
