import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Penilaian Kendiri",
  description:
    "Ambil quiz ringkas dan percuma ini untuk mengetahui di mana anda berada dalam perjalanan keusahawanan anda.",
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
