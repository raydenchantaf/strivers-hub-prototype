"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { questions, getScoreTier, Question } from "@/data/questions";
import ProgressBar from "./ProgressBar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getQuestionType(q: Question) {
  return q.type ?? "single";
}

function computeScore(answers: Record<number, string | string[]>): number {
  return Object.entries(answers).reduce((sum, [qId, ans]) => {
    const q = questions.find((q) => q.id === Number(qId));
    if (!q) return sum;
    const type = getQuestionType(q);
    if (type === "likert") return sum + Number(ans || 0);
    if (type === "multi") {
      const ids = Array.isArray(ans) ? ans : [];
      return sum + ids.reduce((s, id) => {
        const opt = q.options.find((o) => o.id === id);
        return s + (opt?.points ?? 0);
      }, 0);
    }
    // single
    const opt = q.options.find((o) => o.id === ans);
    return sum + (opt?.points ?? 0);
  }, 0);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssessmentEngine() {
  const { t, language } = useLanguage();
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [consented, setConsented] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [selected, setSelected] = useState<string | null>(null);       // single / likert
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);   // multi
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const qType = getQuestionType(currentQuestion);
  const isLast = currentIndex === questions.length - 1;
  const hasAnswer = qType === "multi" ? selectedMulti.length > 0 : selected !== null;

  // ── Restore progress from sessionStorage on mount ─────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sh_progress");
      if (saved) {
        const p = JSON.parse(saved);
        setStarted(p.started ?? false);
        setConsented(p.consented ?? false);
        setChecked(p.checked ?? false);
        setCurrentIndex(p.currentIndex ?? 0);
        setAnswers(p.answers ?? {});
        // Restore the active (possibly uncommitted) selection
        setSelected(p.selected ?? null);
        setSelectedMulti(p.selectedMulti ?? []);
      }
    } catch {
      // Ignore corrupted progress data
    }
    setHydrated(true);
  }, []);

  // ── Persist progress to sessionStorage whenever key state changes ──────────
  // Includes `selected` and `selectedMulti` so an option the user clicked but
  // hasn't confirmed with Next is also preserved across navigation.
  useEffect(() => {
    if (!hydrated) return; // don't overwrite restored data on first render
    sessionStorage.setItem(
      "sh_progress",
      JSON.stringify({ started, consented, checked, currentIndex, answers, selected, selectedMulti })
    );
  }, [hydrated, started, consented, checked, currentIndex, answers, selected, selectedMulti]);

  // ── Multi-choice toggle ───────────────────────────────────────────────────
  function handleSelectMulti(optionId: string) {
    setSelectedMulti((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      const max = currentQuestion.maxSelections ?? Infinity;
      if (prev.length >= max) return prev; // cap reached — ignore
      return [...prev, optionId];
    });
  }

  // ── Next / Submit ─────────────────────────────────────────────────────────
  async function handleNext() {
    if (!hasAnswer) return;

    // Build updated answers record
    const currentAnswer: string | string[] =
      qType === "multi" ? selectedMulti : (selected as string);
    const updated = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updated);

    if (isLast) {
      const finalScore = computeScore(updated);
      const tier = getScoreTier(finalScore);
      const categoryLabel = tier.category[language];

      // Persist result — clear in-progress progress
      sessionStorage.removeItem("sh_progress");
      sessionStorage.setItem("sh_score", String(finalScore));
      sessionStorage.setItem("sh_language", language);

      // Submit to Google Sheets (fire-and-forget)
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
        // Silently ignore — data collection never blocks the UX
      } finally {
        setSubmitting(false);
      }

      router.push("/results");
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Restore selection for the next question if already answered
      const nextQ = questions[nextIndex];
      const nextAns = updated[nextQ?.id];
      if (getQuestionType(nextQ) === "multi") {
        setSelectedMulti(Array.isArray(nextAns) ? nextAns : []);
        setSelected(null);
      } else {
        setSelected(typeof nextAns === "string" ? nextAns : null);
        setSelectedMulti([]);
      }
    }
  }

  // ── Previous ──────────────────────────────────────────────────────────────
  function handlePrev() {
    if (currentIndex === 0) {
      setConsented(false);
      return;
    }
    // Save current partial answer before navigating back
    const currentAnswer: string | string[] =
      qType === "multi" ? selectedMulti : (selected ?? "");
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);

    // Restore selection for the previous question
    const prevQ = questions[prevIndex];
    const prevAns = updatedAnswers[prevQ.id];
    if (getQuestionType(prevQ) === "multi") {
      setSelectedMulti(Array.isArray(prevAns) ? prevAns : []);
      setSelected(null);
    } else {
      setSelected(typeof prevAns === "string" ? prevAns : null);
      setSelectedMulti([]);
    }
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
            {[`${questions.length} Questions`, "~5 Minutes", "Free"].map((tag) => (
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

  // ── Consent screen ────────────────────────────────────────────────────────
  if (!consented) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="card p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                {t("consent.title")}
              </h1>
            </div>

            <div className="h-px bg-gray-100 mb-6" />

            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              {t("consent.body")}
            </p>

            <div className="h-px bg-gray-100 mt-6 mb-5" />

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.target.checked);
                    if (e.target.checked) setShowConsentError(false);
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    checked
                      ? "bg-primary border-primary"
                      : "border-gray-300 bg-white group-hover:border-primary/50"
                  }`}
                >
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 leading-snug">
                {t("consent.checkbox")}
              </span>
            </label>

            {showConsentError && (
              <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t("consent.required")}
              </p>
            )}

            <button
              onClick={() => {
                if (!checked) { setShowConsentError(true); return; }
                setConsented(true);
              }}
              className="btn-primary w-full mt-6 py-3.5 text-base"
            >
              {t("consent.proceed")} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="card mt-6 p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-snug">
            {currentQuestion.text[language]}
          </h2>

          {/* ── Single-choice (radio) ── */}
          {qType === "single" && (
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isChosen = selected === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelected(option.id)}
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
          )}

          {/* ── Multi-choice (checkbox) ── */}
          {qType === "multi" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {language === "en"
                  ? `Select up to ${currentQuestion.maxSelections}`
                  : `Pilih sehingga ${currentQuestion.maxSelections}`}
              </p>

              {currentQuestion.options.map((option) => {
                const isChosen = selectedMulti.includes(option.id);
                const atCap =
                  selectedMulti.length >= (currentQuestion.maxSelections ?? Infinity);
                const isDisabled = !isChosen && atCap;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectMulti(option.id)}
                    disabled={isDisabled}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${
                      isChosen
                        ? "border-primary bg-brand-rose text-primary shadow-sm"
                        : isDisabled
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {/* Checkbox indicator */}
                      <span
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isChosen
                            ? "border-primary bg-primary"
                            : isDisabled
                            ? "border-gray-200 bg-gray-100"
                            : "border-gray-300"
                        }`}
                      >
                        {isChosen && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {option.label[language]}
                    </span>
                  </button>
                );
              })}

              {/* Selection counter */}
              <p className="text-xs text-right text-gray-400 mt-1">
                <span className={selectedMulti.length >= (currentQuestion.maxSelections ?? Infinity) ? "text-primary font-semibold" : ""}>
                  {selectedMulti.length}
                </span>
                {" "}/ {currentQuestion.maxSelections}{" "}
                {language === "en" ? "selected" : "dipilih"}
              </p>
            </div>
          )}

          {/* ── Likert scale (1–5) ── */}
          {qType === "likert" && (
            <div className="py-2">
              {/* Scale buttons */}
              <div className="flex gap-2 sm:gap-3 justify-between mb-3">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isChosen = selected === String(val);
                  return (
                    <button
                      key={val}
                      onClick={() => setSelected(String(val))}
                      className={`flex-1 py-5 rounded-xl border-2 font-bold text-xl transition-all duration-150 ${
                        isChosen
                          ? "border-primary bg-brand-rose text-primary shadow-sm scale-105"
                          : "border-gray-200 bg-white text-gray-500 hover:border-primary/40 hover:bg-gray-50"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* Anchor labels */}
              {currentQuestion.likertLabels && (
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>← {currentQuestion.likertLabels.low[language]}</span>
                  <span>{currentQuestion.likertLabels.high[language]} →</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-4">
          <button onClick={handlePrev} className="btn-outline py-3 px-6">
            ← {t("assess.prev")}
          </button>
          <button
            onClick={handleNext}
            disabled={!hasAnswer || submitting}
            className="btn-primary py-3 px-6 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {language === "en" ? "Saving…" : "Menyimpan…"}
              </>
            ) : isLast ? (
              t("assess.submit")
            ) : (
              `${t("assess.next")} →`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
