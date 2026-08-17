import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wondertaps.in"),
  title: "WonderTaps — Play, listen and learn",
  description: "An animated Hindi, English and Hinglish learning playground for children ages 1–7.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "WonderTaps — Play, listen and learn",
    description: "A magical animal playground for curious little hands.",
    url: "/",
    siteName: "WonderTaps",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "WonderTaps animal friends in Moonlight Meadow" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WonderTaps — Play, listen and learn",
    description: "A magical animal playground for curious little hands.",
    images: ["/og.png"],
  },
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
