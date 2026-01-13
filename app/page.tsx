"use client";

import { supabase } from "../lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("tx_id, sector, item, margin_pct, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

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

      <h2>Latest Evidence Timeline</h2>

      {error && <p>Error reading ledger.</p>}

      {data && data.length > 0 ? (
        data.map((row, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #333",
              paddingBottom: "12px",
              marginBottom: "12px",
            }}
          >
            <p><strong>Transaction ID:</strong> {row.tx_id}</p>
            <p><strong>Sector:</strong> {row.sector}</p>
            <p><strong>Item:</strong> {row.item}</p>
            <p>
              <strong>Margin:</strong>{" "}
              <span
                style={{
                  background: "#f59e0b",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  color: "black",
                }}
              >
                {row.margin_pct}%
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  background: row.status === "EXPOSE" ? "#dc2626" : "#16a34a",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
              >
                {row.status}
              </span>
            </p>
            <p><strong>Timestamp:</strong> {row.created_at}</p>
          </div>
        ))
      ) : (
        <p>No ledger records found.</p>
      )}
    </main>
  );
}
