import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhelKatha — Press, play and learn with animal friends",
  description: "An animated Hindi-English animal sound playground for children ages 1–7.",
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
