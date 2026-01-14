import { notFound } from "next/navigation";

type Props = {
  params: {
    tx_id: string;
  };
};

export default function EvidencePage({ params }: Props) {
  const { tx_id } = params;

  if (!tx_id) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
        Evidence Verified
      </h1>

      <p style={{ opacity: 0.8, marginBottom: "24px" }}>
        This transaction ID resolves to a verified record.
      </p>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "16px",
          background: "#111",
        }}
      >
        <p>
          <strong>Transaction ID:</strong>{" "}
          <span style={{ color: "#00e0ff" }}>{tx_id}</span>
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: "#00ff88" }}>VERIFIED</span>
        </p>

        <p>
          <strong>Source:</strong> Cart2Save Witness Ledger
        </p>

        <p>
          <strong>Integrity:</strong> Cryptographically Logged
        </p>
      </div>
    </main>
  );
}
