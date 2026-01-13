export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>Cart2Save</h1>

      <p style={{ marginTop: "12px", maxWidth: "600px" }}>
        Cart2Save is a neutral commerce intelligence platform.
        It does not recommend, promote, or optimise prices.
      </p>

      <p style={{ marginTop: "12px", maxWidth: "600px" }}>
        The system displays verified market evidence across food,
        groceries, mobility, fashion, pharmacy, electronics,
        and home services.
      </p>

      <hr style={{ margin: "24px 0" }} />

      <h2>System Status</h2>

      <ul>
        <li>Mode: Neutral Evidence Layer</li>
        <li>Execution: Human-Gated</li>
        <li>Ledger Authority: Supabase (Read-Only)</li>
      </ul>

      <p style={{ marginTop: "24px", fontSize: "14px", color: "#666" }}>
        Pranix does not help users save money.
        It helps users see verified cost reality.
      </p>
    </main>
  );
}
