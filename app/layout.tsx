import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AssessmentResetProvider } from "@/context/AssessmentResetContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Strivers' Hub — Elevating Malaysian Women Entrepreneurs",
  description:
    "A platform designed to help Malaysian women MSMEs start, grow, and scale their businesses through tools, training, and community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AssessmentResetProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AssessmentResetProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
