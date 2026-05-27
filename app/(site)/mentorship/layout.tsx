import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "Tingkatkan perniagaan anda bersama usahawanita yang berfikiran sama",
  openGraph: {
    title: "Mentorship | Strivers' Hub",
    description:
      "Tingkatkan perniagaan anda bersama usahawanita yang berfikiran sama",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Mentorship | Strivers' Hub",
    description:
      "Tingkatkan perniagaan anda bersama usahawanita yang berfikiran sama",
  },
};

export default function MentorshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
