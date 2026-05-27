import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Take our free self assessment to understand your current stage and receive personalised resources to help your business grow.",
  robots: { index: false, follow: false },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
