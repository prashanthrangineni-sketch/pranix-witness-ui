import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("protocol_efficiency_ledger")
    .select(
      "tx_id, sector, item, margin_pct, created_at"
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
      }}
    >
      <h1>Cart2Save</h1>

      <p style={{ maxWidth: "600px", opacity: 0.9 }}>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <hr style={{ margin: "24px 0", opacity: 0.3 }} />

      <h2>Evidence Timeline (Latest 20)</h2>

      {error && (
        <p style={{ color: "red" }}>Error loading evidence ledger.</p>
      )}

      {!data || data.length === 0 ? (
        <p>No evidence records found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {data.map((row) => (
            <Link
              key={row.tx_id}
              href={`/evidence?tx_id=${encodeURIComponent(row.tx_id)}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#111",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #222",
                }}
              >
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  <span style={{ color: "#4fd1c5" }}>{row.tx_id}</span>
                </p>

                <p>
                  <strong>Sector:</strong> {row.sector}
                </p>

                <p>
                  <strong>Item:</strong> {row.item ?? "—"}
                </p>

                <p>
                  <strong>Margin:</strong> {row.margin_pct}%
                </p>

                <p style={{ color: "red", fontWeight: "bold" }}>
                  Status: EXPOSE
                </p>

                <p style={{ opacity: 0.6, fontSize: "12px" }}>
                  Tap Transaction ID to view full evidence
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
