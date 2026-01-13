"use client";

import { supabase } from "../lib/supabaseClient";

function StatusBadge({ status }: { status: string }) {
  let color = "#666";

  if (status === "OK") color = "green";
  if (status === "WATCH") color = "orange";
  if (status === "EXPOSE" || status === "KILL") color = "red";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "6px",
        backgroundColor: color,
        color: "white",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}

function MarginBadge({ margin }: { margin: number }) {
  let color = "red";

  if (margin >= 40) color = "green";
  else if (margin >= 15) color = "orange";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "6px",
        backgroundColor: color,
        color: "white",
        fontWeight: "bold",
      }}
    >
      {margin}%
    </span>
  );
}

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select(
      "tx_id, sector, created_at, item, margin_pct, status, sha256_evidence_hash"
    )
    .order("created_at", { ascending: false })
    .limit(1);

  const record = data && data.length > 0 ? data[0] : null;

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

      {!record && <p>No ledger records found.</p>}

      {record && (
        <div style={{ lineHeight: "1.8" }}>
          <p>
            <strong>Transaction ID:</strong> {record.tx_id}
          </p>
          <p>
            <strong>Sector:</strong> {record.sector}
          </p>
          <p>
            <strong>Timestamp:</strong> {record.created_at}
          </p>
          <p>
            <strong>Item:</strong> {record.item}
          </p>
          <p>
            <strong>Margin:</strong>{" "}
            <MarginBadge margin={record.margin_pct} />
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <StatusBadge status={record.status} />
          </p>
          <p>
            <strong>Evidence Hash:</strong> {record.sha256_evidence_hash}
          </p>
        </div>
      )}
    </main>
  );
}
