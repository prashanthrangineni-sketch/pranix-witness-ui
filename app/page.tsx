"use client";

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
    .order("created_at", { ascending: false });

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
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
        Cart2Save
      </h1>

      <p style={{ opacity: 0.85 }}>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <h2>Evidence Timeline</h2>

      {error && (
        <p style={{ color: "red", marginTop: "16px" }}>
          Unable to read ledger.
        </p>
      )}

      {!error && data && data.length === 0 && (
        <p style={{ opacity: 0.7, marginTop: "16px" }}>
          No ledger records found.
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        {data &&
          data.map((row: LedgerRow) => (
            <div
              key={row.tx_id}
              style={{
                background: "#0b0b0b",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ fontWeight: 600 }}>
                Transaction ID:{" "}
                <a
                  href={`/evidence/${row.tx_id}`}
                  style={{
                    color: "#4fd1c5",
                    textDecoration: "underline",
                  }}
                >
                  {row.tx_id}
                </a>
              </p>

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

              <p style={{ opacity: 0.85 }}>
                Evidence Hash: {row.sha256_evidence_hash}
              </p>

              <p style={{ opacity: 0.6, fontSize: "14px" }}>
                Timestamp:{" "}
                {new Date(row.created_at).toLocaleString()}
              </p>

              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  opacity: 0.4,
                }}
              >
                Tap Transaction ID to view full evidence
              </p>
            </div>
          ))}
      </div>
    </main>
  );
}
