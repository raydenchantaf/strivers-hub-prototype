import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papan Pemuka",
  description: "Papan pemuka ahli Strivers' Hub anda.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
