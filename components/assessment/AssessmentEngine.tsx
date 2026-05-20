"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { questions, getScoreTier, Question } from "@/data/questions";
import ProgressBar from "./ProgressBar";
import RegistrationGate from "./RegistrationGate";

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

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

type DropdownOption = { id: string; label: { en: string; bm: string } };

function CustomDropdown({
  options,
  value,
  onChange,
  language,
}: {
  options: DropdownOption[];
  value: string | null;
  onChange: (id: string) => void;
  language: "en" | "bm";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === value);
  const placeholder = language === "en" ? "— Select an option —" : "— Pilih pilihan —";

  return (
    <div ref={ref} className="relative py-2">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full px-4 py-3.5 rounded-xl border-2 font-medium text-sm bg-white flex items-center justify-between gap-2 transition-all duration-150 outline-none ${
          value ? "border-primary text-gray-900" : "border-gray-200 text-gray-400"
        } focus:border-primary`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label[language] : placeholder}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options list */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <button
              key={option.id}
              type="button"
              onClick={() => { onChange(option.id); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-100 ${
                idx === 0 ? "rounded-t-xl" : ""
              } ${idx === options.length - 1 ? "rounded-b-xl" : ""} ${
                value === option.id
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-pink-50 hover:text-primary"
              }`}
            >
              {option.label[language]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  const [showGate, setShowGate]     = useState(false);

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

  // Check login status once on mount — logged-in users skip the gate
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const raw = typeof document !== "undefined"
      ? document.cookie.match(/(^| )sh_user=([^;]+)/)
      : null;
    setIsLoggedIn(!!raw);
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
      // Also persist to cookie so dashboard survives page refresh
      document.cookie = `sh_result=${encodeURIComponent(JSON.stringify({ score: finalScore, category: tier.category[language], label: tier.label[language], color: tier.color }))};path=/;max-age=${60*60*24*30}`;

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

      // If already logged in skip the gate and go straight to results
      if (isLoggedIn) {
        router.push("/results");
      } else {
        setShowGate(true);
      }
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
    const steps = [
      {
        icon: (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        title: t("how2.step1.title"),
        desc: (
          <span>{t("how2.step1.pre")} <strong>{t("how2.step1.bold")}</strong> {t("how2.step1.post")}</span>
        ),
      },
      {
        icon: (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
        title: t("how2.step2.title"),
        desc: <span>{t("how2.step2.desc")}</span>,
      },
      {
        icon: (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        title: t("how2.step3.title"),
        desc: <span>{t("how2.step3.desc")}</span>,
      },
    ];

    return (
      <div className="bg-white">

        {/* Top section — two columns */}
        <div className="container-max section-padding py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Left: label + title */}
            <div>
              <p className="text-primary text-xs font-extrabold uppercase tracking-widest mb-3">
                {t("assess.label")}
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {t("assess.title")}
              </h1>
            </div>

            {/* Right: description + CTA */}
            <div className="flex flex-col items-start gap-6">
              <p className="text-gray-500 text-base leading-relaxed">
                {t("assess.subtitle")}
              </p>
              <button
                onClick={() => setStarted(true)}
                className="btn-primary text-sm py-3 px-7 flex items-center gap-2"
              >
                {t("assess.start")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* 3-step guide */}
        <div className="bg-[#FFF5F8]">
          <div className="container-max section-padding py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
              {steps.map((step, i) => (
                <div key={i} className="flex items-stretch">
                  {/* Step card */}
                  <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 flex-1 shadow-sm">
                    {step.icon}
                    <h3 className="text-base font-extrabold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Arrow between steps */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex items-center px-2 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom image — replace src with your own */}
        <div className="container-max section-padding pt-10 pb-10">
          <div className="rounded-3xl overflow-hidden max-h-[420px]">
            <img
              src="/hero.image.png"
              alt="Assessment"
              className="w-full h-full object-cover object-top"
            />
          </div>
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
    <>
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="card mt-6 p-6 md:p-8 overflow-visible">
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

          {/* ── Dropdown ── */}
          {qType === "dropdown" && (
            <CustomDropdown
              options={currentQuestion.options}
              value={selected}
              onChange={(id) => setSelected(id)}
              language={language}
            />
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

      {/* Registration gate overlay — shown after final submission */}
      {showGate && (
        <RegistrationGate
          onSkip={() => {
            setShowGate(false);
            router.push("/results");
          }}
        />
      )}
    </>
  );
}