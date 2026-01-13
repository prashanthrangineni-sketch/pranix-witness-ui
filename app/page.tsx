"use client";

import { supabase } from "./lib/supabaseClient";
import Link from "next/link";

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("tx_id, sector, item, margin_pct, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main style={{ padding: "24px", background: "black", color: "white" }}>
      <h1>Cart2Save</h1>

      <p>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr />

      <h2>Evidence Timeline (Latest 20)</h2>

      {error && <p>Unable to read ledger.</p>}

      {!data || data.length === 0 ? (
        <p>No ledger records found.</p>
      ) : (
        data.map((row) => (
          <Link
            key={row.tx_id}
            href={`/evidence/${row.tx_id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "12px",
                background: "#111",
                border: "1px solid #333",
              }}
            >
              <p>
                <strong>Transaction ID:</strong>{" "}
                <span style={{ color: "#2dd4bf" }}>{row.tx_id}</span>
              </p>
              <p>Sector: {row.sector}</p>
              <p>Item: {row.item}</p>
              <p>
                Margin: <strong>{row.margin_pct}%</strong>
              </p>
              <p>
                Status: <span style={{ color: "red" }}>EXPOSE</span>
              </p>
              <p style={{ opacity: 0.6 }}>
                Tap Transaction ID to view full evidence
              </p>
            </div>
          </Link>
        ))
      )}
    </main>
  );
}
