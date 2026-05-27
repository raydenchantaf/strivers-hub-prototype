import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description:
    "Cipta akaun Strivers' Hub percuma anda dan mulakan perjalanan pertumbuhan perniagaan anda hari ini.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
