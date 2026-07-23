import type { Metadata } from "next";
import Script from "next/script";

import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site-config";
import { socialLinks } from "@/lib/site-data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: { canonical: "/" },
  title: { default: "Many Ross | Official Artist Experience", template: "%s | Many Ross" },
  description: "Sitio oficial de Many Ross. Musica, videos, YouTube, Spotify, Apple Music, Team Many Ross y experiencias premium en un solo lugar.",
  keywords: ["Many Ross", "Many Ross official", "Many Ross music", "Nivel Leyenda", "Team Many Ross", "Official artist site", "Many Ross YouTube", "Many Ross Spotify"],
  openGraph: {
    title: "Many Ross | Official Artist Experience",
    description: "Una experiencia premium, cinematografica y escalable para centralizar la marca Many Ross.",
    type: "website",
    url: siteConfig.siteUrl,
    siteName: "Many Ross",
    locale: "es_ES",
    images: [{ url: "/images/titanio-y-salitre-cover.png", width: 768, height: 768, alt: "Portada Titanio y Salitre de Many Ross" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Many Ross | Official Artist Experience",
    description: "Musica, videos y comunidad en el sitio oficial de Many Ross.",
    images: ["/images/titanio-y-salitre-cover.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Many Ross",
  url: siteConfig.siteUrl,
  image: `${siteConfig.siteUrl}/images/titanio-y-salitre-cover.png`,
  sameAs: socialLinks.map((item) => item.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Script id="many-ross-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
