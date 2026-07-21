"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { questions, questionsById, getCategorizationScore, getScoreTier, Question } from "@/data/questions";
import ProgressBar from "./ProgressBar";
import RegistrationGate from "./RegistrationGate";

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
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Total questions in the longest path (Yes path, after grouping q5g–q5j into one step) */
const TOTAL_QUESTIONS = 24;

/** Resolve the next question ID given the current question and the answer given */
function resolveNextId(q: Question, answer: string | string[]): string {
  if (typeof answer === "string") {
    const opt = q.options.find((o) => o.id === answer);
    if (opt?.nextId) return opt.nextId;
  }
  return q.nextId;
}

/**
 * Resolve all raw answer IDs to their human-readable labels.
 * Stores answer labels only (not question text) — compact but fully readable at export time.
 */
function buildAnswersReadable(
  allAnswers: Record<string, string | string[]>,
  lang: "en" | "bm",
  otherTexts: Record<string, string> = {},
): Record<string, string> {
  const readable: Record<string, string> = {};

  for (const [qId, answer] of Object.entries(allAnswers)) {
    const q = questionsById[qId];

    if (!q) {
      // Multi-text subfields (q5h, q5i, q5j) — raw text, store as-is
      readable[qId] = typeof answer === "string" ? answer : (answer as string[]).join(", ");
      continue;
    }

    switch (q.type) {
      case "text":
      case "likert":
        readable[qId] = typeof answer === "string" ? answer : "";
        break;
      case "multi-text":
        // q5g is both the parent question ID and first-name field — store its raw value
        readable[qId] = typeof answer === "string" ? answer : "";
        break;
      case "multi": {
        const ids = Array.isArray(answer) ? answer : [answer as string];
        readable[qId] = ids
          .map((id) => {
            const opt = q.options.find((o) => o.id === id);
            // If this option has hasOther and user typed custom text, prefix with "Other: "
            if (opt?.hasOther && otherTexts[qId]) return `Other: ${otherTexts[qId]}`;
            return opt?.label[lang] ?? id;
          })
          .join(", ");
        break;
      }
      default: {
        // single, dropdown
        const opt = q.options.find((o) => o.id === answer);
        // If this option has hasOther and user typed custom text, prefix with "Other: "
        if (opt?.hasOther && otherTexts[qId]) {
          readable[qId] = `Other: ${otherTexts[qId]}`;
        } else {
          readable[qId] = opt?.label[lang] ?? (typeof answer === "string" ? answer : "");
        }
      }
    }
  }

  return readable;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssessmentEngine() {
  const { t, language } = useLanguage();
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [hydrated,          setHydrated]          = useState(false);
  const [started,           setStarted]           = useState(false);
  const [consented,         setConsented]         = useState(false);
  const [checked,           setChecked]           = useState(false);
  const [showConsentError,  setShowConsentError]  = useState(false);

  // Navigation
  const [currentId,  setCurrentId]  = useState("q1");
  const [history,    setHistory]    = useState<string[]>([]);

  // Scroll to top on every question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentId]);

  // Answers (keyed by question ID)
  const [answers,    setAnswers]    = useState<Record<string, string | string[]>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  // Active selection state — reset when navigating to a new question
  const [selected,      setSelected]      = useState<string | null>(null);  // single / likert / dropdown
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);         // multi
  const [textInput,     setTextInput]     = useState("");                    // text
  const [otherInput,    setOtherInput]    = useState("");                    // "other" free text

  const [multiTextInputs, setMultiTextInputs] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [showGate,   setShowGate]   = useState(false);
  const [gatePrefill, setGatePrefill] = useState<{ firstName: string; lastName: string; email: string; phone: string }>({
    firstName: "", lastName: "", email: "", phone: "",
  });

  const currentQuestion = questionsById[currentId];
  const qType           = currentQuestion.type;
  const isLast          = currentQuestion.nextId === "[END]";

  // Derive "other" visibility from current selections
  const selectedOptionHasOther =
    qType === "single" &&
    currentQuestion.options.find((o) => o.id === selected)?.hasOther === true;
  const selectedMultiHasOther =
    qType === "multi" &&
    currentQuestion.options.some((o) => o.hasOther && selectedMulti.includes(o.id));
  const selectedDropdownHasOther =
    qType === "dropdown" &&
    currentQuestion.options.find((o) => o.id === selected)?.hasOther === true;

  // ── hasAnswer ─────────────────────────────────────────────────────────────
  const hasAnswer = (() => {
    if (qType === "multi") {
      const needed = currentQuestion.maxSelections ?? 0;
      if (currentQuestion.exactSelections) {
        if (selectedMulti.length !== needed) return false;
      } else {
        if (selectedMulti.length === 0) return false;
      }
      if (selectedMultiHasOther && otherInput.trim() === "") return false;
      return true;
    }
    if (qType === "text") return textInput.trim().length > 0;
    if (qType === "multi-text") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const f of currentQuestion.fields ?? []) {
        const val = (multiTextInputs[f.id] ?? "").trim();
        if (f.required && val === "") return false;
        if (f.inputType === "email" && val !== "" && !emailRegex.test(val)) return false;
      }
      return true;
    }
    if (qType === "likert") return selected !== null;
    if (qType === "dropdown") {
      if (selected === null) return false;
      if (selectedDropdownHasOther && otherInput.trim() === "") return false;
      return true;
    }
    // single
    if (selected === null) return false;
    if (selectedOptionHasOther && otherInput.trim() === "") return false;
    return true;
  })();

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sh_progress");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.started)   setStarted(true);
        if (p.consented) setConsented(true);
        if (p.checked)   setChecked(true);
        if (p.currentId && questionsById[p.currentId]) setCurrentId(p.currentId);
        if (Array.isArray(p.history))     setHistory(p.history);
        if (p.answers)    setAnswers(p.answers);
        if (p.otherTexts) setOtherTexts(p.otherTexts);
        if (p.selected !== undefined)     setSelected(p.selected);
        if (Array.isArray(p.selectedMulti)) setSelectedMulti(p.selectedMulti);
        if (typeof p.textInput === "string") setTextInput(p.textInput);
        if (typeof p.otherInput === "string") setOtherInput(p.otherInput);
        if (p.multiTextInputs && typeof p.multiTextInputs === "object") setMultiTextInputs(p.multiTextInputs);
      }
    } catch {
      // Ignore corrupted progress data
    }
    setHydrated(true);
  }, []);

  // Check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const raw = typeof document !== "undefined"
      ? document.cookie.match(/(^| )sh_user=([^;]+)/)
      : null;
    setIsLoggedIn(!!raw);
  }, []);

  // ── Auto-skip q5g–q5j for logged-in users (Option A) ────────────────────
  useEffect(() => {
    if (!started || !hydrated || !isLoggedIn) return;
    if (currentId !== "q5g") return;

    try {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("sh_user="))
        ?.split("=")[1];
      if (!raw) return;
      const user = JSON.parse(decodeURIComponent(raw));
      if (!user.firstName || !user.email) return;

      // Auto-populate contact answers from the session, then jump to q5k
      const autoAnswers = {
        ...answers,
        q5g: user.firstName ?? "",
        q5h: user.lastName  ?? "",
        q5i: user.email     ?? "",
        q5j: "",             // phone not in session cookie; optional field
      };

      setAnswers(autoAnswers);
      setCurrentId("q5k");
      restoreSelectionFor("q5k", autoAnswers, otherTexts);
    } catch {
      // Cookie parse failed — fall through and show the screen normally
    }
  }, [currentId, started, hydrated, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist progress ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem("sh_progress", JSON.stringify({
      started, consented, checked, currentId, history,
      answers, otherTexts, selected, selectedMulti, textInput, otherInput, multiTextInputs,
    }));
  }, [hydrated, started, consented, checked, currentId, history,
      answers, otherTexts, selected, selectedMulti, textInput, otherInput, multiTextInputs]);

  // ── Restore selection when navigating to a question ───────────────────────
  function restoreSelectionFor(
    id: string,
    savedAnswers: Record<string, string | string[]>,
    savedOthers: Record<string, string>,
  ) {
    const q   = questionsById[id];
    const ans = savedAnswers[id];
    const other = savedOthers[id] ?? "";
    setOtherInput(other);

    if (q.type === "multi") {
      setSelectedMulti(Array.isArray(ans) ? ans : []);
      setSelected(null);
      setTextInput("");
      setMultiTextInputs({});
    } else if (q.type === "text") {
      setTextInput(typeof ans === "string" ? ans : "");
      setSelected(null);
      setSelectedMulti([]);
      setMultiTextInputs({});
    } else if (q.type === "multi-text") {
      const restored: Record<string, string> = {};
      (q.fields ?? []).forEach((f) => {
        restored[f.id] = typeof savedAnswers[f.id] === "string" ? savedAnswers[f.id] as string : "";
      });
      setMultiTextInputs(restored);
      setSelected(null);
      setSelectedMulti([]);
      setTextInput("");
    } else {
      setSelected(typeof ans === "string" ? ans : null);
      setSelectedMulti([]);
      setTextInput("");
      setMultiTextInputs({});
    }
  }

  // ── Multi-choice toggle ───────────────────────────────────────────────────
  function handleSelectMulti(optionId: string) {
    setSelectedMulti((prev) => {
      if (prev.includes(optionId)) return prev.filter((id) => id !== optionId);
      const max = currentQuestion.maxSelections ?? Infinity;
      if (prev.length >= max) return prev;
      return [...prev, optionId];
    });
    // Clear other text if the "other" option is being deselected
    const opt = currentQuestion.options.find((o) => o.id === optionId);
    if (opt?.hasOther && selectedMulti.includes(optionId)) {
      setOtherInput("");
    }
  }

  // ── Build current answer value ────────────────────────────────────────────
  function getCurrentAnswer(): string | string[] {
    if (qType === "multi") return selectedMulti;
    if (qType === "text")  return textInput.trim();
    return selected ?? "";
  }

  // ── Next / Submit ─────────────────────────────────────────────────────────
  async function handleNext() {
    if (!hasAnswer) return;

    let updatedAnswers: Record<string, string | string[]>;
    let currentAnswer: string | string[];

    if (qType === "multi-text") {
      updatedAnswers = { ...answers };
      (currentQuestion.fields ?? []).forEach((f) => {
        updatedAnswers[f.id] = (multiTextInputs[f.id] ?? "").trim();
      });
      currentAnswer = "";
    } else {
      currentAnswer = getCurrentAnswer();
      updatedAnswers = { ...answers, [currentId]: currentAnswer };
    }

    const updatedOthers  = otherInput.trim()
      ? { ...otherTexts, [currentId]: otherInput.trim() }
      : otherTexts;

    setAnswers(updatedAnswers);
    setOtherTexts(updatedOthers);

    const nextId = qType === "multi-text"
      ? currentQuestion.nextId
      : resolveNextId(currentQuestion, currentAnswer);

    if (nextId === "[END]") {
      setSubmitted(true); // lock the button immediately — prevents double submission

      // Pre-fill registration gate with demographic answers
      setGatePrefill({
        firstName: String(updatedAnswers["q5g"] ?? ""),
        lastName:  String(updatedAnswers["q5h"] ?? ""),
        email:     String(updatedAnswers["q5i"] ?? ""),
        phone:     String(updatedAnswers["q5j"] ?? ""),
      });

      // ── Categorisation scoring ───────────────────────────────────────────
      const catScore = getCategorizationScore(updatedAnswers);
      const tier = getScoreTier(catScore);

      sessionStorage.removeItem("sh_progress");
      sessionStorage.setItem("sh_score", String(catScore));
      sessionStorage.setItem("sh_language", language);
      document.cookie = `sh_result=${encodeURIComponent(
        JSON.stringify({ score: catScore, category: tier.category[language], label: tier.label[language], color: tier.color })
      )};path=/;max-age=${60 * 60 * 24 * 30}`;

      // Submit to Neon (fire-and-forget)
      setSubmitting(true);
      try {
        await fetch("/api/submit-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            score: catScore,
            category: tier.category[language],
            answersReadable: buildAnswersReadable(updatedAnswers, language, updatedOthers),
          }),
        });
      } catch {
        // Silently ignore — data collection never blocks UX
      } finally {
        setSubmitting(false);
      }

      if (isLoggedIn) {
        router.push("/results");
      } else {
        setShowGate(true);
      }
    } else {
      // ── Navigate forward ─────────────────────────────────────────────────
      setHistory((prev) => [...prev, currentId]);
      setCurrentId(nextId);
      restoreSelectionFor(nextId, updatedAnswers, updatedOthers);
    }
  }

  // ── Previous ──────────────────────────────────────────────────────────────
  function handlePrev() {
    if (history.length === 0) {
      setConsented(false);
      return;
    }

    // Save current partial answer before going back
    let updatedAnswers: Record<string, string | string[]>;
    if (qType === "multi-text") {
      updatedAnswers = { ...answers };
      (currentQuestion.fields ?? []).forEach((f) => {
        updatedAnswers[f.id] = (multiTextInputs[f.id] ?? "").trim();
      });
    } else {
      updatedAnswers = { ...answers, [currentId]: getCurrentAnswer() };
    }
    const updatedOthers  = otherInput.trim()
      ? { ...otherTexts, [currentId]: otherInput.trim() }
      : otherTexts;
    setAnswers(updatedAnswers);
    setOtherTexts(updatedOthers);

    const newHistory = [...history];
    const prevId = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentId(prevId);
    restoreSelectionFor(prevId, updatedAnswers, updatedOthers);
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
        title: t("how.step1.title"),
        desc: t("how.step1.desc"),
      },
      {
        icon: (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
        title: t("how.step2.title"),
        desc: t("how.step2.desc"),
      },
      {
        icon: (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        title: t("how.step3.title"),
        desc: t("how.step3.desc"),
      },
    ];

    return (
      <div className="bg-white">
        <div className="container-max section-padding py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary text-xs font-extrabold uppercase tracking-widest mb-3">
                {t("assess.label")}
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {t("assess.title")}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-6">
              <p className="text-gray-500 text-base leading-relaxed">{t("assess.subtitle")}</p>
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

        <div className="bg-[#FFF5F8]">
          <div className="container-max section-padding py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
              {steps.map((step, i) => (
                <Fragment key={i}>
                  {/* Card + desktop right arrow (desktop arrow lives inside the flex row) */}
                  <div className="flex items-stretch">
                    <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 flex-1 shadow-sm">
                      {step.icon}
                      <h3 className="text-base font-extrabold text-gray-900">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc }} />
                    </div>
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
                  {/* Mobile down arrow — separate grid item, centred, hidden on desktop */}
                  {i < steps.length - 1 && (
                    <div className="flex md:hidden justify-center items-center py-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="container-max section-padding pt-10 pb-10">
          <div className="rounded-3xl overflow-hidden max-h-[420px]">
            <img src="/assessment.image.webp" alt="Assessment" className="w-full h-full object-cover object-top" />
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
            <p className="text-gray-600 text-sm leading-relaxed mb-2">{t("consent.body")}</p>
            <div className="h-px bg-gray-100 mt-6 mb-5" />
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => { setChecked(e.target.checked); if (e.target.checked) setShowConsentError(false); }}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  checked ? "bg-primary border-primary" : "border-gray-300 bg-white group-hover:border-primary/50"
                }`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 leading-snug">{t("consent.checkbox")}</span>
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
              onClick={() => { if (!checked) { setShowConsentError(true); return; } setConsented(true); }}
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
  const progressCurrent = history.length + 1;

  return (
    <>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-2xl w-full">

          <ProgressBar current={progressCurrent} total={TOTAL_QUESTIONS} />

          <div className="card mt-6 p-6 md:p-8 overflow-visible">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-snug">
              {currentQuestion.text[language]}
            </h2>

            {/* ── Single-choice ── */}
            {qType === "single" && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => {
                  const isChosen = selected === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => { setSelected(option.id); if (!option.hasOther) setOtherInput(""); }}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${
                        isChosen
                          ? "border-primary bg-brand-rose text-primary shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isChosen ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
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
                {selectedOptionHasOther && (
                  <input
                    type="text"
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    placeholder={language === "en" ? "Please specify…" : "Sila nyatakan…"}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-primary text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                )}
              </div>
            )}

            {/* ── Multi-choice ── */}
            {qType === "multi" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {currentQuestion.exactSelections
                    ? (language === "en" ? `Select exactly ${currentQuestion.maxSelections}` : `Pilih tepat ${currentQuestion.maxSelections}`)
                    : currentQuestion.maxSelections
                    ? (language === "en" ? `Select up to ${currentQuestion.maxSelections}` : `Pilih sehingga ${currentQuestion.maxSelections}`)
                    : (language === "en" ? "Select all that apply" : "Pilih semua yang berkenaan")}
                </p>

                {currentQuestion.options.map((option) => {
                  const isChosen  = selectedMulti.includes(option.id);
                  const atCap     = !isChosen && selectedMulti.length >= (currentQuestion.maxSelections ?? Infinity);
                  const isDisabled = atCap;

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
                        <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isChosen ? "border-primary bg-primary" : isDisabled ? "border-gray-200 bg-gray-100" : "border-gray-300"
                        }`}>
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

                {selectedMultiHasOther && (
                  <input
                    type="text"
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    placeholder={language === "en" ? "Please specify…" : "Sila nyatakan…"}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-primary text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                )}

                {currentQuestion.maxSelections && (
                  <p className="text-xs text-right text-gray-400 mt-1">
                    <span className={selectedMulti.length >= currentQuestion.maxSelections ? "text-primary font-semibold" : ""}>
                      {selectedMulti.length}
                    </span>
                    {" "}/ {currentQuestion.maxSelections}{" "}
                    {language === "en" ? "selected" : "dipilih"}
                  </p>
                )}
              </div>
            )}

            {/* ── Dropdown ── */}
            {qType === "dropdown" && (
              <>
                <CustomDropdown
                  options={currentQuestion.options}
                  value={selected}
                  onChange={(id) => {
                    setSelected(id);
                    const opt = currentQuestion.options.find((o) => o.id === id);
                    if (!opt?.hasOther) setOtherInput("");
                  }}
                  language={language}
                />
                {selectedDropdownHasOther && (
                  <input
                    type="text"
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    placeholder={language === "en" ? "Please specify…" : "Sila nyatakan…"}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-primary text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                )}
              </>
            )}

            {/* ── Multi-text (contact details group) ── */}
            {qType === "multi-text" && (
              <div className="flex flex-col gap-5">
                {(currentQuestion.fields ?? []).map((field) => {
                  const val = multiTextInputs[field.id] ?? "";
                  const isEmail = field.inputType === "email";
                  const emailInvalid = isEmail && val.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        {field.label[language]}
                        {!field.required && (
                          <span className="ml-1.5 normal-case font-normal text-gray-400">
                            {language === "en" ? "(optional)" : "(pilihan)"}
                          </span>
                        )}
                      </label>
                      <input
                        type={field.inputType ?? "text"}
                        inputMode={field.inputType === "tel" ? "tel" : undefined}
                        value={val}
                        onChange={(e) => setMultiTextInputs((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder?.[language] ?? ""}
                        className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                          emailInvalid
                            ? "border-red-400 focus:border-red-400"
                            : "border-gray-200 focus:border-primary"
                        }`}
                      />
                      {emailInvalid && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {language === "en" ? "Please enter a valid email address." : "Sila masukkan alamat e-mel yang sah."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Likert scale (1–5) ── */}
            {qType === "likert" && (
              <div className="py-2">
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
                {currentQuestion.likertLabels && (
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>← {currentQuestion.likertLabels.low[language]}</span>
                    <span>{currentQuestion.likertLabels.high[language]} →</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Text input ── */}
            {qType === "text" && (
              <div className="py-2">
                <input
                  type={currentQuestion.inputType ?? "text"}
                  inputMode={currentQuestion.inputType === "number" ? "numeric" : undefined}
                  min={currentQuestion.inputType === "number" ? 0 : undefined}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={currentQuestion.placeholder?.[language] ?? ""}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => { if (e.key === "Enter" && hasAnswer) handleNext(); }}
                />
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
              disabled={!hasAnswer || submitting || submitted}
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

      {showGate && (
        <RegistrationGate
          prefill={gatePrefill}
          onSkip={() => { setShowGate(false); router.push("/results"); }}
        />
      )}
    </>
  );
}