import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Strivers' Hub — a Mastercard Inclusive for Growth initiative by The Asia Foundation empowering Malaysian women MSMEs to grow and thrive.",
  openGraph: {
    title: "About Us | Strivers' Hub",
    description:
      "Learn about Strivers' Hub — a Mastercard Inclusive for Growth initiative by The Asia Foundation empowering Malaysian women MSMEs to grow and thrive.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "About Us | Strivers' Hub",
    description:
      "Learn about Strivers' Hub — a Mastercard Inclusive for Growth initiative by The Asia Foundation empowering Malaysian women MSMEs to grow and thrive.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
