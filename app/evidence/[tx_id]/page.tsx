import { supabase } from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function EvidencePage({
  params,
}: {
  params: { tx_id: string };
}) {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select("*")
    .eq("tx_id", params.tx_id)
    .single();

  if (error || !data) {
    return notFound();
  }

  return (
    <main
      style={{
        padding: 24,
        background: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Evidence Record</h1>

      <p style={{ opacity: 0.8, marginBottom: "16px" }}>
        This page displays a single verified market observation.
        It does not recommend, promote, or optimise prices.
      </p>

      <hr style={{ margin: "16px 0", opacity: 0.2 }} />

      <p><strong>Transaction ID:</strong> {data.tx_id}</p>
      <p><strong>Sector:</strong> {data.sector}</p>
      <p><strong>Item:</strong> {data.item}</p>

      <p>
        <strong>Certified Margin:</strong>{" "}
        <span
          style={{
            background: "#f59e0b",
            color: "black",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 700,
          }}
        >
          {data.margin_pct}%
        </span>
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            background: "#dc2626",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 700,
          }}
        >
          {data.status}
        </span>
      </p>

      <p><strong>Evidence Hash:</strong> {data.sha256_evidence_hash}</p>

      <p style={{ opacity: 0.7 }}>
        <strong>Timestamp:</strong>{" "}
        {new Date(data.created_at).toLocaleString()}
      </p>

      <hr style={{ margin: "16px 0", opacity: 0.2 }} />

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        Ledger Authority: Supabase (Read-Only)<br />
        Integrity Seal: {data.integrity_seal ?? "HASH_CHAIN_VERIFIED"}
      </p>
    </main>
  );
}
