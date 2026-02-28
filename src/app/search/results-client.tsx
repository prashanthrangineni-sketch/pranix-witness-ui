"use client";

import { useEffect, useState } from "react";

export default function ResultsClient({ query }: { query: string }) {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data || []);
      });
  }, [query]);

  if (!query) return <p>Please enter a search query.</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        results.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: "8px",
              marginBottom: "12px"
            }}
          >
            <strong>{item.title}</strong>
            <p>₹ {item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
