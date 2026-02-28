import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10
      }}
    >
      <Link href="/">
        <strong>Cart2Save</strong>
      </Link>

      <SearchBar />
    </header>
  );
}
