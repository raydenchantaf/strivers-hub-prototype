"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getScoreTier, getMaxScore, ScoreTier } from "@/data/questions";
import { useAssessmentReset } from "@/context/AssessmentResetContext";
import { resources } from "@/data/resources";
import AssessmentResultCard from "@/components/assessment/AssessmentResultCard";

export default function ResultsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { bumpReset } = useAssessmentReset();
  const [tier, setTier]   = useState<ScoreTier | null>(null);
  const [score, setScore] = useState<number>(0);
  const maxScore = getMaxScore();
  const recommended = resources.slice(0, 3);

  useEffect(() => {
    const savedScore = Number(sessionStorage.getItem("sh_score") ?? 0);
    const savedLang  = sessionStorage.getItem("sh_language") as "en" | "bm" | null;
    if (savedLang) setLanguage(savedLang);
    setScore(savedScore);
    setTier(getScoreTier(savedScore));
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

        {/* Score card — identical to Dashboard */}
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

        {/* Recommended resources — same as Dashboard */}
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
                <img src={r.imageUrl} alt={r.title[language]} className="w-full h-40 object-cover" />
                <div className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{r.category}</span>
                  <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{r.title[language]}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{r.excerpt[language]}</p>
                  <Link href="/resources" className="text-xs font-semibold text-primary hover:underline mt-auto">
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
