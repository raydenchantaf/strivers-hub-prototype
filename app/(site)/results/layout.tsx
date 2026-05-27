import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Results",
  description: "View your personalised business assessment results and recommended next steps.",
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
