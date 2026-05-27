"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getScoreTier, getMaxScore, ScoreTier } from "@/data/questions";
import { useAssessmentReset } from "@/context/AssessmentResetContext";
import { getResourcesByGrade, urlFor, SanityResource } from "@/lib/sanity";
import AssessmentResultCard from "@/components/assessment/AssessmentResultCard";

export default function ResultsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { bumpReset } = useAssessmentReset();
  const [tier, setTier]               = useState<ScoreTier | null>(null);
  const [score, setScore]             = useState<number>(0);
  const [recommended, setRecommended] = useState<SanityResource[]>([]);
  const maxScore = getMaxScore();

  useEffect(() => {
    const savedScore = Number(sessionStorage.getItem("sh_score") ?? 0);
    const savedLang  = sessionStorage.getItem("sh_language") as "en" | "bm" | null;
    if (savedLang) setLanguage(savedLang);
    setScore(savedScore);
    const t = getScoreTier(savedScore);
    setTier(t);

    // Fetch grade-matched resources from Sanity
    const grade = t.category.en.toLowerCase();
    getResourcesByGrade(grade)
      .then((data: SanityResource[]) => setRecommended(data))
      .catch(() => setRecommended([]));
  }, [setLanguage]);

  if (!tier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-10">
        <div className="container-max">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">
            {t("results.title")}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {tier.label[language]}
          </h1>
        </div>
      </div>

      <div className="container-max section-padding py-10 flex flex-col gap-10">

        {/* Score card */}
        <section>
          <AssessmentResultCard
            score={score}
            maxScore={maxScore}
            tier={tier}
            language={language}
          />
          <div className="mt-4 flex gap-3">
            <Link
              href="/assessment"
              onClick={bumpReset}
              className="text-sm font-semibold px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {t("results.retake")}
            </Link>
            <Link
              href="/"
              className="text-sm font-medium px-5 py-2.5 rounded-full text-gray-500 hover:text-primary transition-colors"
            >
              {t("notfound.home")}
            </Link>
          </div>
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
