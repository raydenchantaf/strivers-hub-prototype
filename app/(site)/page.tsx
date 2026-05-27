import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strivers' Hub — Meningkatkan Usahawan Wanita Malaysia",
  description:
    "Strivers' Hub memperkasakan wanita PKS Malaysia untuk memulakan, mengembangkan, dan meluaskan perniagaan — dengan alat percuma, latihan, bimbingan, dan komuniti yang menyokong.",
  openGraph: {
    title: "Strivers' Hub — Meningkatkan Usahawan Wanita Malaysia",
    description:
      "Strivers' Hub memperkasakan wanita PKS Malaysia untuk memulakan, mengembangkan, dan meluaskan perniagaan — dengan alat percuma, latihan, bimbingan, dan komuniti yang menyokong.",
    url: "https://prototype1.strivershub.com",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Strivers' Hub" }],
  },
  twitter: {
    title: "Strivers' Hub — Meningkatkan Usahawan Wanita Malaysia",
    description:
      "Strivers' Hub memperkasakan wanita PKS Malaysia untuk memulakan, mengembangkan, dan meluaskan perniagaan — dengan alat percuma, latihan, bimbingan, dan komuniti yang menyokong.",
  },
};

import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import MyDigital from "@/components/landing/MyDigital";
import PartnerStrip from "@/components/landing/PartnerStrip";
import Stats from "@/components/landing/Stats";
import CommunitySection from "@/components/landing/CommunitySection";
import CTABanner from "@/components/landing/CTABanner";
import InsightsGrid from "@/components/landing/InsightsGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <MyDigital />
    </>
  );
}
