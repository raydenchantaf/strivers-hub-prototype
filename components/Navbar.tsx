"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { bumpReset } = useAssessmentReset();
  const pathname = usePathname();

  const navLinks = [
    { key: "nav.assessment", href: "/assessment", onClickExtra: bumpReset },
    { key: "nav.resources",  href: "/resources" },
    { key: "nav.financing",  href: "/financing" },
    { key: "nav.events",     href: "/events" },
    { key: "nav.about",      href: "#" },
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container-max section-padding py-2 px-4 md:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.svg" alt="Strivers Hub" width={185} height={55} />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-6">

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={link.onClickExtra}
                    className={[
                      "text-sm font-medium transition-colors",
                      active
                        ? "text-primary"
                        : "text-[#222222] hover:text-primary",
                    ].join(" ")}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "bm" : "en")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-400 text-xs font-semibold text-[#222222] hover:border-primary hover:text-primary transition-colors"
            >
              <span className={language === "en" ? "text-primary" : "text-[#222222]"}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={language === "bm" ? "text-primary" : "text-[#222222]"}>BM</span>
            </button>

            {/* CTA */}
            <Link
              href="/assessment"
              onClick={bumpReset}
              className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex"
            >
              {t("nav.joinNow")}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => { link.onClickExtra?.(); setMenuOpen(false); }}
                  className={[
                    "px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    active
                      ? "text-primary bg-pink-50 border-l-2 border-primary pl-[10px]"
                      : "text-[#222222] hover:text-primary hover:bg-pink-50",
                  ].join(" ")}
                >
                  {t(link.key)}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <Link
                href="/assessment"
                onClick={() => { bumpReset(); setMenuOpen(false); }}
                className="btn-primary w-full text-center text-sm py-2.5"
              >
                {t("nav.joinNow")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
