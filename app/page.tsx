"use client";

import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type LedgerRow = {
  tx_id: string;
  sector: string;
  item: string;
  margin_pct: number;
  status: string;
  sha256_evidence_hash: string;
  created_at: string;
};

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select(
      "tx_id, sector, item, margin_pct, status, sha256_evidence_hash, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main
      style={{
        padding: "24px",
        background: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px" }}>Cart2Save</h1>

      <p style={{ opacity: 0.85, marginTop: "8px" }}>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <h2>Evidence Timeline (Latest 20)</h2>

      {error && <p style={{ color: "red" }}>Unable to read ledger.</p>}

      {!error && data && data.length === 0 && (
        <p>No ledger records found.</p>
      )}

      {data?.map((row) => (
        <div
          key={row.tx_id}
          style={{
            background: "#0b0b0b",
            borderRadius: "12px",
            padding: "16px",
            marginTop: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href={`/evidence/${row.tx_id}`}
            style={{ color: "#4fd1c5", fontWeight: 600 }}
          >
            Transaction ID: {row.tx_id}
          </Link>

          <p>Sector: {row.sector}</p>
          <p>Item: {row.item}</p>

          <p>
            Margin:{" "}
            <span
              style={{
                background: "#f59e0b",
                color: "black",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 700,
              }}
            >
              {row.margin_pct}%
            </span>
          </p>

          <p>
            Status:{" "}
            <span
              style={{
                background: "#dc2626",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 700,
              }}
            >
              {row.status}
            </span>
          </p>

          <p style={{ opacity: 0.6 }}>
            Timestamp: {new Date(row.created_at).toLocaleString()}
          </p>

          <p style={{ opacity: 0.4, fontSize: "13px" }}>
            Tap Transaction ID to view full evidence
          </p>
        </div>
      ))}

      <footer
        style={{
          marginTop: "40px",
          opacity: 0.4,
          fontSize: "12px",
        }}
      >
        Ledger Authority: Supabase (Read-Only)
      </footer>
    </main>
  );
}
