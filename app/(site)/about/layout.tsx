import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Strivers' Hub: Memacu Kejayaan Keusahawanan Melalui Peluang Digital",
  openGraph: {
    title: "Tentang Kami | Strivers' Hub",
    description:
      "Strivers' Hub: Memacu Kejayaan Keusahawanan Melalui Peluang Digital",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Tentang Kami | Strivers' Hub",
    description:
      "Strivers' Hub: Memacu Kejayaan Keusahawanan Melalui Peluang Digital",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
