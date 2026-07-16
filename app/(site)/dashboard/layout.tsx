import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papan Pemuka",
  description: "Papan pemuka ahli Strivers' Hub anda.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
