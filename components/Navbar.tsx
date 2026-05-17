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
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const { bumpReset } = useAssessmentReset();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isResourcesActive =
    isActive("/resources") || isActive("/financing") || isActive("/events");

  const resourcesChildren = [
    { key: "nav.resources", href: "/resources" },
    { key: "nav.financing", href: "/financing" },
    { key: "nav.events", href: "/events" },
  ];

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container-max section-padding py-2 px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/logo.svg" alt="Strivers Hub" width={185} height={55} />
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-5">

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-7">

                {/* Assessment */}
                <Link
                  href="/assessment"
                  onClick={bumpReset}
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive("/assessment") ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}
                >
                  {t("nav.assessment")}
                </Link>

                {/* Resources dropdown */}
                <div className="relative group">
                  <button
                    className={[
                      "flex items-center gap-1 text-sm font-medium transition-colors",
                      isResourcesActive ? "text-primary" : "text-[#222222] hover:text-primary",
                    ].join(" ")}
                  >
                    {t("nav.resources")}
                    <svg
                      className="w-3.5 h-3.5 mt-0.5 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50 min-w-[160px]">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden">
                      {resourcesChildren.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className={[
                            "block px-4 py-2.5 text-sm font-medium transition-colors",
                            isActive(child.href)
                              ? "text-primary bg-pink-50"
                              : "text-[#222222] hover:text-primary hover:bg-pink-50",
                          ].join(" ")}
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mentorship */}
                <Link
                  href="/mentorship"
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive("/mentorship") ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}
                >
                  {t("nav.mentorship")}
                </Link>

                {/* About */}
                <Link
                  href="/about"
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive("/about") ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}
                >
                  {t("nav.about")}
                </Link>

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

              {/* CTA buttons — desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold py-2 px-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  {t("nav.joinNow")}
                </Link>
              </div>

              {/* Hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden">

          {/* Overlay header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
            <Link href="/" onClick={close}>
              <Image src="/logo.svg" alt="Strivers Hub" width={160} height={48} />
            </Link>
            <button
              onClick={close}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links — scrollable middle */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">

            {/* Assessment */}
            <Link
              href="/assessment"
              onClick={() => { bumpReset(); close(); }}
              className={[
                "flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/assessment")
                  ? "text-primary bg-pink-50 border-l-4 border-primary"
                  : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.assessment")}
            </Link>

            {/* Resources accordion */}
            <div>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={[
                  "w-full flex items-center justify-between px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                  isResourcesActive
                    ? "text-primary bg-pink-50 border-l-4 border-primary"
                    : "text-gray-800 hover:text-primary hover:bg-pink-50",
                ].join(" ")}
              >
                <span>{t("nav.resources")}</span>
                <svg
                  className={["w-5 h-5 transition-transform", resourcesOpen ? "rotate-180" : ""].join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
                  {resourcesChildren.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      onClick={close}
                      className={[
                        "py-3 px-3 text-sm font-medium rounded-lg transition-colors",
                        isActive(child.href)
                          ? "text-primary"
                          : "text-gray-500 hover:text-primary",
                      ].join(" ")}
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mentorship */}
            <Link
              href="/mentorship"
              onClick={close}
              className={[
                "flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/mentorship")
                  ? "text-primary bg-pink-50 border-l-4 border-primary"
                  : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.mentorship")}
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={close}
              className={[
                "flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/about")
                  ? "text-primary bg-pink-50 border-l-4 border-primary"
                  : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.about")}
            </Link>


            {/* Divider */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">

              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "bm" : "en")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <span className={language === "en" ? "text-primary" : "text-gray-500"}>EN</span>
                <span className="text-gray-300">|</span>
                <span className={language === "bm" ? "text-primary" : "text-gray-500"}>BM</span>
              </button>

              <Link
                href="/login"
                onClick={close}
                className="w-full text-center text-sm font-semibold py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="btn-primary w-full text-center text-sm py-3.5"
              >
                {t("nav.joinNow")}
              </Link>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
