"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ size = "small" }: { size?: "small" | "large" }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        width: size === "large" ? "100%" : "300px"
      }}
    >
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: size === "large" ? "14px" : "10px",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: size === "large" ? "14px 18px" : "10px 14px",
          background: "#111827",
          color: "#fff",
          borderRadius: "8px",
          border: "none"
        }}
      >
        Search
      </button>
    </div>
  );
}
