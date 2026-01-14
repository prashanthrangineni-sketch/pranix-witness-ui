export const dynamic = "force-dynamic";

export default function EvidencePage({ params }: { params: { tx_id: string } }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#0ff",
        padding: "40px",
        fontFamily: "monospace",
      }}
    >
      <h1>✅ Evidence Route Working</h1>

      <p>If you can see this page, routing is FIXED.</p>

      <hr />

      <h3>Transaction ID</h3>
      <pre>{params?.tx_id}</pre>
    </main>
  );
}
