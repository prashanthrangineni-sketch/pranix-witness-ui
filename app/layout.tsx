import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart2Save",
  description: "Neutral price discovery across sectors in India"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `
            }}
          />
        )}
      </body>
    </html>
  );
}
