import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dasar Privasi",
  description:
    "Baca Dasar Privasi Strivers' Hub untuk memahami bagaimana kami mengumpul, menggunakan, dan melindungi data peribadi anda.",
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
