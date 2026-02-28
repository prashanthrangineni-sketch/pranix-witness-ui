import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { sector: string };
}): Promise<Metadata> {
  return {
    title: `${params.sector} price comparison in India | Cart2Save`,
    description: `Compare ${params.sector} prices across India. Neutral discovery by Cart2Save.`
  };
}

export default function SectorPage({
  params
}: {
  params: { sector: string };
}) {
  const sector = params.sector;

  return (
    <main style={{ padding: "2rem" }}>
      <nav style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
        Home › {sector}
      </nav>

      <h1 style={{ textTransform: "capitalize" }}>
        {sector} Deals & Comparisons
      </h1>

      <p style={{ marginTop: "10px", color: "#444" }}>
        Explore price discovery and comparisons for {sector} across India.
      </p>
    </main>
  );
}
