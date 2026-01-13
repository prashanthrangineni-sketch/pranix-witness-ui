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
    <main style={{ padding: 24, background: "black", color: "white" }}>
      <h1>Cart2Save</h1>

      <p>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr />

      <h2>Evidence Timeline</h2>

      {error && <p>Unable to read ledger.</p>}
      {!data || data.length === 0 && <p>No ledger records found.</p>}

      {data?.map((row) => (
        <div key={row.tx_id} style={{ marginBottom: 24 }}>
          <p>
            <strong>
              <Link href={`/evidence/${row.tx_id}`} style={{ color: "#4fd1c5" }}>
                Transaction ID: {row.tx_id}
              </Link>
            </strong>
          </p>
          <p>Sector: {row.sector}</p>
          <p>Item: {row.item}</p>
          <p>Margin: {row.margin_pct}%</p>
          <p>Status: {row.status}</p>
          <p>Evidence Hash: {row.sha256_evidence_hash}</p>
          <p>
            Timestamp: {new Date(row.created_at).toLocaleString()}
          </p>
          <hr />
        </div>
      ))}
    </main>
  );
}
