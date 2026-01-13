"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function EvidencePage() {
  const searchParams = useSearchParams();
  const txId = searchParams.get("tx_id");

  // SAFE DEMO DATA
  const records: Record<string, any> = {
    "PX-HYD-TEST-001": {
      sector: "grocery",
      item: "Sona Masuri Rice 10kg",
      margin: "25%",
      status: "EXPOSE",
      hash: "testhash001",
    },
    "PX-HYD-TEST-004": {
      sector: "food",
      item: "Sona Masuri Rice 10kg",
      margin: "25%",
      status: "EXPOSE",
      hash: "testhash004",
    },
    "PX-HYD-20260113-0001": {
      sector: "grocery",
      item: "10kg Sona Masuri Rice",
      margin: "25%",
      status: "EXPOSE",
      hash: "demo_hash_001",
    },
    "PX-HYD-20260113-0002": {
      sector: "Food/Grocery",
      item: "10kg Sona Masuri Rice",
      margin: "25%",
      status: "EXPOSE",
      hash: "demo_hash_002",
    },
  };

  const record = txId ? records[txId] : null;

  return (
    <main style={pageStyle}>
      <Link href="/" style={backLink}>← Back to Timeline</Link>

      {!txId && (
        <h2>Evidence not found<br /><small>Requested ID: undefined</small></h2>
      )}

      {txId && !record && (
        <h2>
          Evidence not found
          <br />
          <small>Requested ID: {txId}</small>
        </h2>
      )}

      {record && (
        <>
          <h1>Evidence Record</h1>

          <div style={card}>
            <p><strong>Transaction ID:</strong> {txId}</p>
            <p><strong>Sector:</strong> {record.sector}</p>
            <p><strong>Item:</strong> {record.item}</p>
            <p><strong>Margin:</strong> {record.margin}</p>
            <p style={{ color: "red", fontWeight: "bold" }}>
              Status: {record.status}
            </p>
            <p><strong>Evidence Hash:</strong> {record.hash}</p>
          </div>
        </>
      )}
    </main>
  );
}

const pageStyle = {
  padding: "24px",
  background: "black",
  color: "white",
  minHeight: "100vh",
};

const card = {
  background: "#111",
  padding: "16px",
  borderRadius: "12px",
  maxWidth: "600px",
};

const backLink = {
  display: "inline-block",
  marginBottom: "16px",
  color: "#4fd1c5",
};
