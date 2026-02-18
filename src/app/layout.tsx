import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decoding Trainer",
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
      <body>{children}</body>
    </html>
  );
}
