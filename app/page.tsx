import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
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
      <PartnerStrip />
      <Stats />
      <CommunitySection />
      <CTABanner />
      <InsightsGrid />
    </>
  );
}
