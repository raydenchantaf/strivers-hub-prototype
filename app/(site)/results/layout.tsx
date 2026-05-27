import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keputusan Penilaian",
  description:
    "Lihat keputusan penilaian perniagaan anda yang diperibadikan dan langkah seterusnya yang disyorkan.",
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
