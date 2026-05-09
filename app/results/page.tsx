"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getScoreTier, getMaxScore, ScoreTier } from "@/data/questions";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function ResultsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { bumpReset } = useAssessmentReset();
  const [tier, setTier] = useState<ScoreTier | null>(null);
  const [score, setScore] = useState<number>(0);
  const maxScore = getMaxScore();

  useEffect(() => {
    const savedScore = Number(sessionStorage.getItem("sh_score") ?? 0);
    const savedLang = sessionStorage.getItem("sh_language") as "en" | "bm" | null;
    if (savedLang) setLanguage(savedLang);
    setScore(savedScore);
    setTier(getScoreTier(savedScore));
  }, [setLanguage]);

  if (!tier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">Loading your results…</div>
      </div>
    );
  }

  const percent = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose/30 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            {t("results.title")}
          </h1>
          <p className="text-gray-500 text-sm">
            {t("assess.question")} {score} / {maxScore} {t("results.score").toLowerCase()}
          </p>
        </div>

        {/* Score card */}
        <div className="card p-6 md:p-8 mb-6">
          {/* Circular score indicator */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={tier.color}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - percent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{score}</span>
                <span className="text-xs text-gray-400">/{maxScore}</span>
              </div>
            </div>

            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white mb-2"
              style={{ backgroundColor: tier.color }}
            >
              {tier.category[language].toUpperCase()}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center">
              {tier.label[language]}
            </h2>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed text-center">
            {tier.description[language]}
          </p>
        </div>

        {/* Next Steps */}
        <div className="card p-6 md:p-8 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🗺️</span> {t("results.next_steps")}
          </h3>
          <ul className="space-y-3">
            {tier.nextSteps[language].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                  style={{ backgroundColor: tier.color }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/resources" className="btn-primary text-center py-3.5 px-6">
            {t("results.explore")} →
          </Link>
          <Link href="/assessment" onClick={bumpReset} className="btn-outline text-center py-3.5 px-6">
            {t("results.retake")}
          </Link>
          <Link href="/" className="text-center py-3.5 px-6 text-gray-500 font-medium text-sm hover:text-primary transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
