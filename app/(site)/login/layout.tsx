import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log Masuk",
  description: "Log masuk ke akaun Strivers' Hub anda.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
