import Link from "next/link";

export default async function Home() {
  // TEMP STATIC DATA (safe for now)
  const timeline = [
    {
      tx_id: "PX-HYD-TEST-001",
      sector: "grocery",
      item: "Sona Masuri Rice 10kg",
      margin_pct: 25,
    },
    {
      tx_id: "PX-HYD-TEST-004",
      sector: "food",
      item: "Sona Masuri Rice 10kg",
      margin_pct: 25,
    },
    {
      tx_id: "PX-HYD-20260113-0001",
      sector: "grocery",
      item: "10kg Sona Masuri Rice",
      margin_pct: 25,
    },
    {
      tx_id: "PX-HYD-20260113-0002",
      sector: "Food/Grocery",
      item: "10kg Sona Masuri Rice",
      margin_pct: 25,
    },
  ];

  return (
    <main style={pageStyle}>
      <h1>Cart2Save</h1>

      <p style={subtitle}>
        Cart2Save is a neutral commerce intelligence platform. It does not
        recommend, promote, or optimise prices.
      </p>

      <h2>Evidence Timeline (Latest 20)</h2>

      {timeline.map((row) => (
        <div key={row.tx_id} style={cardStyle}>
          <p>
            <strong>Transaction ID:</strong>{" "}
            <Link
              href={`/evidence?tx_id=${row.tx_id}`}
              style={{ color: "#4fd1c5", textDecoration: "underline" }}
            >
              {row.tx_id}
            </Link>
          </p>

          <p><strong>Sector:</strong> {row.sector}</p>
          <p><strong>Item:</strong> {row.item}</p>
          <p><strong>Margin:</strong> {row.margin_pct}%</p>

          <p style={{ color: "red", fontWeight: "bold" }}>
            Status: EXPOSE
          </p>

          <p style={muted}>Tap Transaction ID to view full evidence</p>
        </div>
      ))}
    </main>
  );
}

const pageStyle = {
  padding: "24px",
  background: "black",
  color: "white",
  minHeight: "100vh",
};

const subtitle = {
  opacity: 0.8,
  maxWidth: "600px",
  marginBottom: "24px",
};

const cardStyle = {
  background: "#111",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
  maxWidth: "600px",
};

const muted = {
  opacity: 0.6,
  fontSize: "12px",
};
