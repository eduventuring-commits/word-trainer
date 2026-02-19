import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multisyllable Word Detective",
  description:
    "A dyslexia-friendly morphology trainer to practise roots, prefixes, and suffixes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
