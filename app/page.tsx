"use client";

import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select(
      "tx_id, sector, item, margin_pct, status, sha256_evidence_hash, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main
      style={{
        padding: "24px",
        background: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
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

      {/* SYSTEM STATUS */}
      <h2>System Status</h2>
      <p>Mode: Neutral Evidence Layer</p>
      <p>Execution: Human-Gated</p>
      <p>Ledger Authority: Supabase (Read-Only)</p>

      <hr />

      {/* LEGEND */}
      <h2>Evidence Status Legend</h2>
      <p>
        <strong>EXPOSE</strong> — Observed margin exceeds the neutral disclosure
        threshold. This is a visibility signal, not a recommendation.
      </p>
      <p>
        <strong>Margin (%)</strong> — Certified percentage difference between
        observed market price and reference benchmark.
      </p>
      <p>
        <strong>Evidence Hash</strong> — Cryptographic reference used to verify
        integrity of the recorded observation.
      </p>

      <hr />

      {/* ERROR STATE */}
      {error && <p style={{ color: "red" }}>Unable to read ledger.</p>}

      {/* EMPTY STATE */}
      {!data || data.length === 0 ? (
        <p>No ledger records found.</p>
      ) : (
        <>
          <h2>Evidence Timeline</h2>

          {data.map((row) => (
            <div
              key={row.tx_id}
              style={{
                border: "1px solid #2d3748",
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
                background: "#0b0b0b",
              }}
            >
              <p style={{ color: "#4fd1c5", fontWeight: "bold" }}>
                <Link href={`/evidence/${row.tx_id}`}>
                  Transaction ID: {row.tx_id}
                </Link>
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
                    borderRadius: 6,
                    fontWeight: "bold",
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
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontWeight: "bold",
                  }}
                >
                  {row.status}
                </span>
              </p>

              <p>Evidence Hash: {row.sha256_evidence_hash}</p>

              <p style={{ opacity: 0.8 }}>
                Timestamp:{" "}
                {new Date(row.created_at).toLocaleString()}
              </p>

              <p style={{ fontSize: 12, opacity: 0.6 }}>
                Tap Transaction ID to view full evidence
              </p>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
