export default function Footer() {
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
      © {new Date().getFullYear()} Cart2Save — Neutral Discovery Platform
    </footer>
  );
}
