import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AssessmentResetProvider } from "@/context/AssessmentResetContext";
import Navbar from "@/components/Navbar";
import Footer2 from "@/components/Footer2";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Strivers' Hub — Elevating Malaysian Women Entrepreneurs",
  description:
    "A platform designed to help Malaysian women MSMEs start, grow, and scale their businesses through tools, training, and community.",
  icons: {
    icon: "/favicon.png",
  },
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
        <LanguageProvider>
          <AssessmentResetProvider>
            <Navbar />
            <main>{children}</main>
            <Footer2 />
          </AssessmentResetProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
