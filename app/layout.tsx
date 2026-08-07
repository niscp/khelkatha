import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "नन्ही दुनिया — Hindi rhyme adventures for little fingers",
  description: "Tap, sing, count and play through original adventures inspired by beloved Hindi childhood rhymes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
