import type { Metadata, Viewport } from "next";
import { assetPath } from "@/lib/paths";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const socialImageUrl = `${siteUrl.replace(/\/$/, "")}/artworks/camel.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Find the Camel! — Online Exhibition",
    template: "%s — Ekaterina Zueva"
  },
  description: "Enter a quiet, immersive online exhibition of hand-cut collages by Ekaterina Zueva.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Find the Camel! — Online Exhibition",
    description: "A quiet, immersive online exhibition of hand-cut collages.",
    type: "website",
    images: [{ url: socialImageUrl, width: 1171, height: 1280 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Camel! — Online Exhibition",
    description: "A quiet, immersive online exhibition of hand-cut collages.",
    images: [socialImageUrl]
  },
  icons: { icon: assetPath("/icons/favicon.svg") }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f0e9"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          <a className="sr-only-focusable" href="#main-content">Skip to content</a>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
