import "./globals.css";

export const metadata = {
  title: "Pranix Witness",
  description: "Pranix AI Labs Sovereign Witness System"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
