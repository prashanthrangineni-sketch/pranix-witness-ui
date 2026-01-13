"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [sectorFilter, setSectorFilter] = useState("all");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLedger = async () => {
      let query = supabase
        .from("protocol_efficiency_ledger")
        .select(
          "tx_id, sector, item, margin_pct, status, sha256_evidence_hash, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(10);

      if (sectorFilter !== "all") {
        query = query.eq("sector", sectorFilter);
      }

      const { data, error } = await query;

      if (error) {
        setError("Unable to read ledger.");
        setData([]);
      } else {
        setError(null);
        setData(data || []);
      }
    };

    fetchLedger();
  }, [sectorFilter]);

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

      <h2>Evidence Status Legend</h2>
      <p>
        <strong>EXPOSE</strong> — The observed margin exceeds the neutral
        disclosure threshold. This is a visibility signal, not a recommendation.
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

      <h2>Evidence Timeline</h2>

      <label>
        Filter by sector:&nbsp;
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          style={{ padding: "6px", marginBottom: "20px" }}
        >
          <option value="all">All</option>
          <option value="grocery">grocery</option>
          <option value="food">food</option>
          <option value="Food/Grocery">Food/Grocery</option>
        </select>
      </label>

      <br />
      <br />

      {error && <p>{error}</p>}

      {!error && data.length === 0 && <p>No ledger records found.</p>}

      {!error &&
        data.map((row) => (
          <div key={row.tx_id} style={{ marginBottom: "32px" }}>
            <p><strong>Transaction ID:</strong> {row.tx_id}</p>
            <p><strong>Sector:</strong> {row.sector}</p>
            <p><strong>Item:</strong> {row.item}</p>

            <p>
              <strong>Margin:</strong>{" "}
              <span
                style={{
                  background: "#f59e0b",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {row.margin_pct}%
              </span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  background: "#dc2626",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {row.status}
              </span>
            </p>

            <p><strong>Evidence Hash:</strong> {row.sha256_evidence_hash}</p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(row.created_at).toLocaleString()}
            </p>

            <hr />
          </div>
        ))}
    </main>
  );
}
