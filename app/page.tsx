import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Cart2Save – Witness UI</h1>

      <p>Home page is working.</p>

      <Link href="/evidence/TEST123">
        Go to Evidence TEST123
      </Link>
    </main>
  );
}
