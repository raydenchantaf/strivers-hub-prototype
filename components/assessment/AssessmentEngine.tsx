"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { questions, getScoreTier } from "@/data/questions";
import ProgressBar from "./ProgressBar";

export default function AssessmentEngine() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> optionId
  const [selected, setSelected] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const totalScore = Object.entries(answers).reduce((sum, [qId, optId]) => {
    const q = questions.find((q) => q.id === Number(qId));
    const opt = q?.options.find((o) => o.id === optId);
    return sum + (opt?.points ?? 0);
  }, 0);

  function handleSelect(optionId: string) {
    setSelected(optionId);
  }

  async function handleNext() {
    if (!selected) return;
    const updated = { ...answers, [currentQuestion.id]: selected };
    setAnswers(updated);

    if (isLast) {
      // Calculate final score
      const finalScore = Object.entries(updated).reduce((sum, [qId, optId]) => {
        const q = questions.find((q) => q.id === Number(qId));
        const opt = q?.options.find((o) => o.id === optId);
        return sum + (opt?.points ?? 0);
      }, 0);

      // Determine category label for the sheet
      const tier = getScoreTier(finalScore);
      const categoryLabel = tier.category[language];

      // Save to sessionStorage for Results page
      sessionStorage.setItem("sh_score", String(finalScore));
      sessionStorage.setItem("sh_language", language);

      // Submit to Google Sheets (fire-and-forget — failure never blocks the user)
      setSubmitting(true);
      try {
        await fetch("/api/submit-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            score: finalScore,
            category: categoryLabel,
            answers: updated,
          }),
        });
      } catch {
        // Silently ignore — data collection should never break the UX
      } finally {
        setSubmitting(false);
      }

      router.push("/results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(answers[questions[currentIndex + 1]?.id] ?? null);
    }
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selected ?? "" }));
    setCurrentIndex((i) => i - 1);
    setSelected(answers[questions[currentIndex - 1].id] ?? null);
  }

  // ── Start screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            {t("assess.title")}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">{t("assess.subtitle")}</p>

          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {["10 Questions", "~5 Minutes", "Free"].map((tag) => (
              <span
                key={tag}
                className="bg-brand-rose text-primary text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary text-base py-4 px-10">
            {t("assess.start")} →
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {/* Question card */}
        <div className="card mt-6 p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-snug">
            {currentQuestion.text[language]}
          </h2>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => {
              const isChosen = selected === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${
                    isChosen
                      ? "border-primary bg-brand-rose text-primary shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChosen ? "border-primary bg-primary" : "border-gray-300"
                      }`}
                    >
                      {isChosen && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </span>
                    {option.label[language]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-outline py-3 px-6 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {t("assess.prev")}
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || submitting}
            className="btn-primary py-3 px-6 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : isLast ? t("assess.submit") : `${t("assess.next")} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
