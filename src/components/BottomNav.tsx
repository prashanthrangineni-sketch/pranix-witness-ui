"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        padding: "12px",
        background: "#ffffff",
        borderTop: "1px solid #eee"
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/merchant/enroll">Merchant</Link>
      <Link href="/gig/enroll">Gig</Link>
    </nav>
  );
}
