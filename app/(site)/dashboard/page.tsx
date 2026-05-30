"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getScoreTier, getMaxScore } from "@/data/questions";
import { getResourcesByGrade, urlFor, SanityResource } from "@/lib/sanity";
import AssessmentResultCard from "@/components/assessment/AssessmentResultCard";

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
  const [session, setSession]             = useState<Session | null>(null);
  const [result, setResult]               = useState<AssessmentResult | null>(null);
  const [loggingOut, setLoggingOut]       = useState(false);
  const [loadingResult, setLoadingResult] = useState(true);
  const [recommended, setRecommended]     = useState<SanityResource[]>([]);

  useEffect(() => {
    const raw = getCookie("sh_user");
    if (!raw) { router.push("/login"); return; }
    try {
      const parsed: Session = JSON.parse(raw);
      setSession(parsed);
    } catch {
      router.push("/login");
      return;
    }

    fetch("/api/get-assessment")
      .then((r) => r.json())
      .then((data) => {
        let score: number | null = null;
        if (data.success && data.result) {
          score = data.result.score;
          const lang = (data.result.language as "en" | "bm") ?? language;
          const tier = getScoreTier(score!);
          setResult({ score: score!, category: tier.category[lang], label: tier.label[lang], color: tier.color });
        } else {
          const resultRaw = getCookie("sh_result");
          if (resultRaw) {
            try {
              const parsed = JSON.parse(resultRaw);
              setResult(parsed);
              score = parsed.score;
            } catch {}
          } else {
            const s = sessionStorage.getItem("sh_score");
            const lang = (sessionStorage.getItem("sh_language") as "en" | "bm") ?? language;
            if (s) {
              score = Number(s);
              const tier = getScoreTier(score);
              setResult({ score, category: tier.category[lang], label: tier.label[lang], color: tier.color });
            }
          }
        }

        // Fetch grade-matched resources once score is known
        if (score !== null) {
          const grade = getScoreTier(score).category.en.toLowerCase();
          getResourcesByGrade(grade)
            .then((data: SanityResource[]) => setRecommended(data))
            .catch(() => setRecommended([]));
        }
      })
      .catch(() => {
        const resultRaw = getCookie("sh_result");
        if (resultRaw) {
          try { setResult(JSON.parse(resultRaw)); } catch {}
        }
      })
      .finally(() => setLoadingResult(false));
  }, [router, language]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  const tier     = result ? getScoreTier(result.score) : null;
  const maxScore = getMaxScore();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-max section-padding py-10 flex items-center justify-between gap-4 flex-wrap">
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

        {/* Assessment result */}
        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">
            {t("dashboard.assessment.title")}
          </h2>
          {loadingResult ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : result && tier ? (
            <AssessmentResultCard
              score={result.score}
              maxScore={maxScore}
              tier={tier}
              language={language}
              retakeSlot={
                <Link
                  href="/assessment"
                  className="text-sm font-semibold px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {t("dashboard.assessment.retake")}
                </Link>
              }
            />
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
        {recommended.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-gray-900">
                {t("dashboard.resources.title")}
              </h2>
              <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">
                {t("dashboard.resources.viewAll")}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommended.map((r) => {
                const title   = language === "bm" ? r.title_bm   : r.title_en;
                const excerpt = language === "bm" ? r.excerpt_bm : r.excerpt_en;
                const imageSource = (language === "bm" && r.image_bm) ? r.image_bm : r.image_en;
                const imgSrc  = imageSource
                  ? urlFor(imageSource).width(600).height(338).fit("crop").auto("format").url()
                  : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80";
                return (
                  <div key={r._id} className="card group hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={imageSource?.alt || title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {r.category?.map((cat) => (
                          <span key={cat._id} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-orange/20 text-brand-orange">
                            {language === "bm" ? cat.title_bm : cat.title_en}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mb-1.5">
                        {new Date(r.publishedAt).toLocaleDateString(
                          language === "bm" ? "ms-MY" : "en-MY",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                      <Link href={`/resources/${r.slug.current}`}>
                        <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">
                        {excerpt}
                      </p>
                      <Link
                        href={`/resources/${r.slug.current}`}
                        className="text-primary font-semibold text-xs hover:underline"
                      >
                        {t("dashboard.resources.readMore")} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
