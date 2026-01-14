import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "monospace",
        background: "#000",
        color: "#0ff",
        minHeight: "100vh",
      }}
    >
      <h1>Cart2Save – Witness UI</h1>

      <p>Home page is working.</p>

      <p>
        <Link href="/evidence/TEST123" style={{ color: "#0ff" }}>
          Go to Evidence TEST123 →
        </Link>
      </p>
    </main>
  );
}
