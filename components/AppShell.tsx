"use client";

import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { AssessmentResetProvider } from "@/context/AssessmentResetContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * AppShell wraps every page with Navbar/Footer/providers — EXCEPT /studio,
 * which needs a clean full-page viewport for the Sanity Studio SPA.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <AssessmentResetProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </AssessmentResetProvider>
    </LanguageProvider>
  );
}
