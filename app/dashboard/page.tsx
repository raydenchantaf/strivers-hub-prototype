"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { resources } from "@/data/resources";
import { getScoreTier, getMaxScore } from "@/data/questions";

interface Session {
  firstName: string;
  lastName: string;
  email: string;
}

interface AssessmentResult {
  score: number;
  category: string;
  label: string;
  color: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // sh_user is a plain readable cookie (not httpOnly) — safe to read via JS
    const raw = getCookie("sh_user");
    if (!raw) { router.push("/login"); return; }
    try {
      const parsed: Session = JSON.parse(raw);
      setSession(parsed);
    } catch {
      router.push("/login");
      return;
    }

    // Read assessment result cookie
    const resultRaw = getCookie("sh_result");
    if (resultRaw) {
      try { setResult(JSON.parse(resultRaw)); } catch {}
    } else {
      // Fall back to sessionStorage
      const score = sessionStorage.getItem("sh_score");
      const lang = (sessionStorage.getItem("sh_language") as "en" | "bm") ?? language;
      if (score) {
        const tier = getScoreTier(Number(score));
        setResult({
          score: Number(score),
          category: tier.category[lang],
          label: tier.label[lang],
          color: tier.color,
        });
      }
    }
  }, [router, language]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  const tier = result ? getScoreTier(result.score) : null;
  const maxScore = getMaxScore();
  const recommended = resources.slice(0, 3);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Dashboard header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-10">
        <div className="container-max flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">
              {t("dashboard.title")}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {t("dashboard.welcome")} {session.firstName}!
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t("dashboard.logout")}
          </button>
        </div>
      </div>

      <div className="container-max section-padding py-10 flex flex-col gap-10">

        {/* Assessment result card */}
        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">
            {t("dashboard.assessment.title")}
          </h2>

          {result && tier ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Score circle */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
                    style={{ borderColor: result.color }}
                  >
                    <span className="text-3xl font-extrabold text-gray-900">{result.score}</span>
                    <span className="text-xs text-gray-400">/ {maxScore}</span>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: result.color }}
                  >
                    {tier.category[language]}
                  </span>
                </div>

                {/* Description + next steps */}
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    {tier.label[language]}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {tier.description[language]}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {tier.nextSteps[language].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: result.color }}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                <Link
                  href="/assessment"
                  className="text-sm font-semibold px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {t("dashboard.assessment.retake")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm max-w-md">{t("dashboard.assessment.none")}</p>
              <Link href="/assessment" className="btn-primary text-sm py-2.5 px-6">
                {t("dashboard.assessment.take")} →
              </Link>
            </div>
          )}
        </section>

        {/* Recommended resources */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">
              {t("dashboard.resources.title")}
            </h2>
            <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">
              {t("dashboard.resources.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommended.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={r.imageUrl}
                  alt={r.title[language]}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {r.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-gray-900 leading-snug">
                    {r.title[language]}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {r.excerpt[language]}
                  </p>
                  <Link
                    href="/resources"
                    className="text-xs font-semibold text-primary hover:underline mt-auto"
                  >
                    {t("dashboard.resources.readMore")} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
