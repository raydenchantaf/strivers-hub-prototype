import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your free Strivers' Hub account and start your business growth journey today.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
