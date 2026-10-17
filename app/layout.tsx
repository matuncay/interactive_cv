import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/data";
import { DevModeProvider } from "@/components/DevMode";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — ${profile.role}`, template: `%s · ${profile.name}` },
  description: `${profile.tagline}. ${profile.about}`,
  keywords: ["Full Stack Engineer", "Node.js", "TypeScript", "PostgreSQL", "Digital Transformation", "Enterprise Solutions", "Munich"],
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: { type: "profile", title: `${profile.name} — ${profile.role}`, description: profile.headline, url: profile.siteUrl, siteName: profile.name },
  twitter: { card: "summary_large_image", title: profile.name, description: profile.headline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.siteUrl,
  sameAs: [profile.linkedin, profile.github],
  address: { "@type": "PostalAddress", addressLocality: "Munich", addressCountry: "DE" },
  alumniOf: "Hof University of Applied Sciences",
  knowsLanguage: profile.languages,
  knowsAbout: ["Node.js", "TypeScript", "React", "Angular", "PostgreSQL", "Docker", "Kubernetes", "Requirements Engineering"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="grain">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <DevModeProvider>
          <Background />
          <Cursor />
          {children}
        </DevModeProvider>
      </body>
    </html>
  );
}
