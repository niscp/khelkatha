import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wondertaps.in"),
  title: "WonderTaps — Play, listen and learn",
  description: "An animated Hindi, English and Hinglish learning playground for children ages 1–7.",
  alternates: { canonical: "/" },
  manifest: "./manifest.webmanifest",
  appleWebApp: { capable: true, title: "WonderTaps", statusBarStyle: "black-translucent" },
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#18202d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
