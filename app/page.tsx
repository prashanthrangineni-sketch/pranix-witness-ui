"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLedger = async () => {
      const { data, error } = await supabase
        .from("protocol_efficiency_ledger")
        .select(
          "tx_id, sector, created_at, item, margin_pct, status, sha256_evidence_hash"
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        setError("Error reading ledger.");
      } else if (data && data.length > 0) {
        setRecord(data[0]);
      }
    };

    fetchLedger();
  }, []);

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

      {error && <p>{error}</p>}

      {!error && !record && <p>No ledger records found.</p>}

      {record && (
        <div>
          <p><strong>Transaction ID:</strong> {record.tx_id}</p>
          <p><strong>Sector:</strong> {record.sector}</p>
          <p><strong>Timestamp:</strong> {record.created_at}</p>

          <p><strong>Item:</strong> {record.item}</p>
          <p><strong>Margin (%):</strong> {record.margin_pct}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Evidence Hash:</strong> {record.sha256_evidence_hash}</p>
        </div>
      )}
    </main>
  );
}
