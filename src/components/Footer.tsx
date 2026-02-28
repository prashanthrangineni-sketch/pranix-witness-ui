import Link from "next/link";

export default function Footer() {
  const sectors = [
    "grocery",
    "electronics",
    "pharmacy",
    "mobility",
    "beauty_wellness",
    "apparel_fashion",
    "food",
    "home_services"
  ];

  return (
    <footer
      style={{
        padding: "40px 20px",
        borderTop: "1px solid #eee",
        marginTop: "40px",
        textAlign: "center",
        fontSize: "14px",
        color: "#666"
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        {sectors.map((sector) => (
          <Link
            key={sector}
            href={`/sector/${sector}`}
            style={{ margin: "0 10px" }}
          >
            {sector}
          </Link>
        ))}
      </div>

      © {new Date().getFullYear()} Cart2Save — Neutral Discovery
    </footer>
  );
}
