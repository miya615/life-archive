import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  variable: "--font-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Life Chronicle",
  description: "人生の第二の脳 — 思い出・学び・気づきを美しく記録し、数年後に振り返る",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Life Chronicle",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`h-full ${notoSansJP.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
