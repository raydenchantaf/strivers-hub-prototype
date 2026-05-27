import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  // ── Site-wide baseline ────────────────────────────────────────────────────
  // Page files override `title` and `description`; everything else is inherited.
  metadataBase: new URL("https://prototype1.strivershub.com"),

  title: {
    default: "Strivers' Hub — Elevating Malaysian Women Entrepreneurs",
    template: "%s | Strivers' Hub",
  },
  description:
    "A platform designed to help Malaysian women MSMEs start, grow, and scale their businesses through tools, training, and community.",

  icons: {
    icon: "/favicon.png",
  },

  // ── Default Open Graph ────────────────────────────────────────────────────
  // Replace /og-default.png in your /public folder with your preferred image.
  // Recommended size: 1200 × 630 px
  openGraph: {
    siteName: "Strivers' Hub",
    type: "website",
    locale: "en_MY",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Strivers' Hub — Elevating Malaysian Women Entrepreneurs",
      },
    ],
  },

  // ── Default Twitter / X card ──────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },

  // ── Indexing (prototype — keep noindex until go-live) ─────────────────────
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ── Google Analytics 4 ── */}
        {process.env.GOOGLE_ANALYTIC_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTIC_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GOOGLE_ANALYTIC_ID}');
              `}
            </Script>
          </>
        )}

        {/*
         * AppShell conditionally applies Navbar/Footer/providers.
         * /studio renders as a clean full-page viewport (no shell).
         */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
