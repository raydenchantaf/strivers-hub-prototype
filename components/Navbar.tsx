"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

interface UserSession {
  firstName: string;
  lastName: string;
  email: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function getInitials(user: UserSession) {
  return (
    (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
  ).toUpperCase();
}

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [user, setUser]               = useState<UserSession | null>(null);
  const [avatarOpen, setAvatarOpen]   = useState(false);
  const avatarRef                     = useRef<HTMLDivElement>(null);
  const { bumpReset }                 = useAssessmentReset();
  const pathname                      = usePathname();
  const router                        = useRouter();

  // Read sh_user cookie on mount and on every route change (picks up login + logout)
  useEffect(() => {
    const raw = getCookie("sh_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { setUser(null); }
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setAvatarOpen(false);
    setMenuOpen(false);
    router.push("/");
  }

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isResourcesActive =
    isActive("/resources") || isActive("/financing") || isActive("/events");

  const resourcesChildren = [
    { key: "nav.resources", href: "/resources" },
    { key: "nav.financing", href: "/financing" },
    { key: "nav.events",    href: "/events"    },
  ];

  const close = () => setMenuOpen(false);

  // ── Avatar button (desktop + mobile shared logic) ──────────────────────────
  const AvatarButton = () => (
    <div className="relative" ref={avatarRef}>
      <button
        onClick={() => setAvatarOpen((o) => !o)}
        className="w-10 h-10 rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
        aria-label="Account menu"
      >
        {user ? getInitials(user) : "?"}
      </button>

      {avatarOpen && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

          {/* Header: avatar + name + email */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {user ? getInitials(user) : "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Links */}
          <div className="py-1.5">
            <Link
              href="/dashboard"
              onClick={() => setAvatarOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors"
            >
              {t("nav.dashboard")}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              {t("nav.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

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

                <Link
                  href="/assessment"
                  onClick={bumpReset}
                  className={["text-sm font-medium transition-colors",
                    isActive("/assessment") ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}
                >
                  {t("nav.assessment")}
                </Link>

                {/* Resources dropdown */}
                <div className="relative group">
                  <button className={["flex items-center gap-1 text-sm font-medium transition-colors",
                    isResourcesActive ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}>
                    {t("nav.resources")}
                    <svg className="w-3.5 h-3.5 mt-0.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50 min-w-[160px]">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden">
                      {resourcesChildren.map((child) => (
                        <Link key={child.key} href={child.href}
                          className={["block px-4 py-2.5 text-sm font-medium transition-colors",
                            isActive(child.href) ? "text-primary bg-pink-50" : "text-[#222222] hover:text-primary hover:bg-pink-50",
                          ].join(" ")}
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href="/mentorship"
                  className={["text-sm font-medium transition-colors",
                    isActive("/mentorship") ? "text-primary" : "text-[#222222] hover:text-primary",
                  ].join(" ")}
                >
                  {t("nav.mentorship")}
                </Link>

                <Link href="/about"
                  className={["text-sm font-medium transition-colors",
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

              {/* CTA area — desktop */}
              <div className="hidden sm:flex items-center gap-2">
                {user ? (
                  <AvatarButton />
                ) : (
                  <>
                    <Link href="/login"
                      className="text-sm font-semibold py-2 px-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors min-w-[110px] text-center"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link href="/register" className="btn-primary text-sm py-2 px-4 min-w-[110px] text-center">
                      {t("nav.joinUs")}
                    </Link>
                  </>
                )}
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

          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
            <Link href="/" onClick={close}>
              <Image src="/logo.svg" alt="Strivers Hub" width={160} height={48} />
            </Link>
            <button onClick={close} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">

            <Link href="/assessment" onClick={() => { bumpReset(); close(); }}
              className={["flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/assessment") ? "text-primary bg-pink-50 border-l-4 border-primary" : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.assessment")}
            </Link>

            {/* Resources accordion */}
            <div>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={["w-full flex items-center justify-between px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                  isResourcesActive ? "text-primary bg-pink-50 border-l-4 border-primary" : "text-gray-800 hover:text-primary hover:bg-pink-50",
                ].join(" ")}
              >
                <span>{t("nav.resources")}</span>
                <svg className={["w-5 h-5 transition-transform", resourcesOpen ? "rotate-180" : ""].join(" ")} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {resourcesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
                  {resourcesChildren.map((child) => (
                    <Link key={child.key} href={child.href} onClick={close}
                      className={["py-3 px-3 text-sm font-medium rounded-lg transition-colors",
                        isActive(child.href) ? "text-primary" : "text-gray-500 hover:text-primary",
                      ].join(" ")}
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/mentorship" onClick={close}
              className={["flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/mentorship") ? "text-primary bg-pink-50 border-l-4 border-primary" : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.mentorship")}
            </Link>

            <Link href="/about" onClick={close}
              className={["flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors",
                isActive("/about") ? "text-primary bg-pink-50 border-l-4 border-primary" : "text-gray-800 hover:text-primary hover:bg-pink-50",
              ].join(" ")}
            >
              {t("nav.about")}
            </Link>

            {/* Bottom actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">

              <button
                onClick={() => setLanguage(language === "en" ? "bm" : "en")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <span className={language === "en" ? "text-primary" : "text-gray-500"}>EN</span>
                <span className="text-gray-300">|</span>
                <span className={language === "bm" ? "text-primary" : "text-gray-500"}>BM</span>
              </button>

              {user ? (
                <>
                  {/* Logged-in user info */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {getInitials(user)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={close}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t("nav.dashboard")}
                  </Link>
                  <Link href="/profile" onClick={close}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t("nav.profile")}
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close}
                    className="w-full text-center text-sm font-semibold py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link href="/register" onClick={close} className="btn-primary w-full text-center text-sm py-3.5">
                    {t("nav.joinUs")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
