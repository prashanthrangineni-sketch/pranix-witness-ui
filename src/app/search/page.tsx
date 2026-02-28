import { Suspense } from "react";
import ResultsClient from "./results-client";

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Search Results</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ResultsClient query={query} />
      </Suspense>
    </main>
  );
}
