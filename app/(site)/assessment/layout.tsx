import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Penilaian Kendiri",
  description:
    "Ambil ujian ringkas dan percuma ini untuk mengetahui di mana anda berada dalam perjalanan keusahawanan anda.",
  robots: { index: false, follow: false },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
