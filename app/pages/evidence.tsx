import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../app/lib/supabaseClient";

export default function EvidencePage() {
  const router = useRouter();
  const { tx_id } = router.query;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tx_id) return;

    async function load() {
      const { data, error } = await supabase
        .from("protocol_efficiency_ledger")
        .select("*")
        .eq("tx_id", tx_id)
        .single();

      if (!error) setData(data);
      setLoading(false);
    }

    load();
  }, [tx_id]);

  if (!tx_id) {
    return (
      <main style={pageStyle}>
        <h1>Evidence not found</h1>
        <p>Requested ID: undefined</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <p>Loading evidence…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={pageStyle}>
        <h1>Evidence not found</h1>
        <p>This transaction ID does not resolve to a verified record.</p>
        <p>Requested ID: {tx_id}</p>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <h1>Evidence Record</h1>

      <div style={cardStyle}>
        <p><strong>Transaction ID:</strong> {data.tx_id}</p>
        <p><strong>Sector:</strong> {data.sector}</p>
        <p><strong>Item:</strong> {data.item}</p>
        <p><strong>Margin:</strong> {data.margin_pct}%</p>

        <p style={{ color: "red", fontWeight: "bold" }}>
          Status: EXPOSE
        </p>

        <p style={muted}>Evidence Hash: {data.evidence_hash}</p>
        <p style={muted}>
          Timestamp: {new Date(data.created_at).toLocaleString()}
        </p>
      </div>
    </main>
  );
}

const pageStyle = {
  padding: "24px",
  background: "black",
  color: "white",
  minHeight: "100vh",
};

const cardStyle = {
  background: "#111",
  borderRadius: "12px",
  padding: "16px",
  maxWidth: "600px",
};

const muted = {
  opacity: 0.7,
  fontSize: "12px",
};
