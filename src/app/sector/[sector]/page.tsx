import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { sector: string };
}): Promise<Metadata> {
  return {
    title: `${params.sector} price comparison in India | Cart2Save`,
    description: `Compare ${params.sector} prices across India.`
  };
}

export default function SectorPage({
  params
}: {
  params: { sector: string };
}) {
  const sector = params.sector;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cart2save.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sector,
        item: `https://cart2save.com/sector/${sector}`
      }
    ]
  };

  return (
    <main style={{ padding: "2rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd)
        }}
      />

      <nav style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
        Home › {sector}
      </nav>

      <h1 style={{ textTransform: "capitalize" }}>
        {sector} Deals & Comparisons
      </h1>
    </main>
  );
}
