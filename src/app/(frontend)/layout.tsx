import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins, Mulish } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "https://igrejanorio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  title: {
    default: "Igreja no Rio — Santíssimo, RJ",
    template: "%s — Igreja no Rio",
  },
  description:
    "Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro. Cultos, grupos caseiros, blog e materiais de estudo.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Igreja no Rio",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Igreja no Rio",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      "zVoVtbyWEF_aoYieMdzO7wcwKa2jrEDNdTXe2yw-vYs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${mulish.variable}`}>
      <body className="min-h-screen font-body text-ink antialiased">
        <Suspense fallback={null}>
          <MetaPixel />
          <GoogleAnalytics />
        </Suspense>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
