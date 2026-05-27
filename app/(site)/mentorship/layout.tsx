import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "Connect with experienced mentors who can guide your business journey. Explore mentorship opportunities available through Strivers' Hub.",
  openGraph: {
    title: "Mentorship | Strivers' Hub",
    description:
      "Connect with experienced mentors who can guide your business journey. Explore mentorship opportunities available through Strivers' Hub.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Mentorship | Strivers' Hub",
    description:
      "Connect with experienced mentors who can guide your business journey. Explore mentorship opportunities available through Strivers' Hub.",
  },
};

export default function MentorshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
