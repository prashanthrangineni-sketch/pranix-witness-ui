import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, " ")} price in India | Cart2Save`,
    description: `Check price comparisons for ${params.slug.replace(
      /-/g,
      " "
    )} across India.`
  };
}

export default function ProductPage({
  params
}: {
  params: { slug: string };
}) {
  const productName = params.slug.replace(/-/g, " ");

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ textTransform: "capitalize" }}>{productName}</h1>

      <p style={{ marginTop: "12px", color: "#444" }}>
        Compare prices and discover offers for {productName}.
      </p>
    </main>
  );
}
