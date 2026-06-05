"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  articleSlug:  string;
  articleTitle: string;
}

const STORAGE_KEY = (slug: string) => `feedback_submitted_${slug}`;

const LABELS: Record<number, { en: string; bm: string }> = {
  1: { en: "Poor",      bm: "Lemah"       },
  2: { en: "Fair",      bm: "Sederhana"   },
  3: { en: "Good",      bm: "Baik"        },
  4: { en: "Very Good", bm: "Sangat Baik" },
  5: { en: "Excellent", bm: "Cemerlang"   },
};

export default function FeedbackWidget({ articleSlug, articleTitle }: Props) {
  const { language } = useLanguage();
  const isBm = language === "bm";

  const [hovered,   setHovered]   = useState(0);
  const [selected,  setSelected]  = useState(0);
  const [notes,     setNotes]     = useState("");
  const [status,    setStatus]    = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [prevRating, setPrevRating] = useState<number | null>(null);

  // On mount — check localStorage for a previous submission
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY(articleSlug));
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed >= 1 && parsed <= 5) {
        setPrevRating(parsed);
        setSelected(parsed);
        setStatus("done");
      }
    }
  }, [articleSlug]);

  const activeRating = hovered || selected;
  const label = activeRating ? (isBm ? LABELS[activeRating].bm : LABELS[activeRating].en) : "";

  async function handleSubmit() {
    if (!selected) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/feedback", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          article_slug:  articleSlug,
          article_title: articleTitle,
          rating:        selected,
          notes:         notes.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("API error");

      localStorage.setItem(STORAGE_KEY(articleSlug), String(selected));
      setPrevRating(selected);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleResubmit() {
    setStatus("idle");
    setNotes("");
    // Keep selected at previous rating so user can adjust
  }

  return (
    <div className="mt-12 rounded-2xl bg-brand-rose px-6 py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
        {isBm ? "Maklum Balas Anda" : "Your Feedback"}
      </p>

      {status === "done" ? (
        /* ── Thank-you state ── */
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={`w-7 h-7 ${i <= (prevRating ?? 0) ? "text-primary" : "text-white"}`}
                fill="currentColor" viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {isBm ? "Terima kasih atas maklum balas anda!" : "Thank you for your feedback!"}
          </p>
          <button
            onClick={handleResubmit}
            className="text-xs text-primary underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            {isBm ? "Kemaskini maklum balas" : "Update my feedback"}
          </button>
        </div>
      ) : (
        /* ── Rating form ── */
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            {isBm
              ? "Sejauh mana artikel ini membantu anda?"
              : "How helpful was this article to you?"}
          </p>

          {/* Heart rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${i} ${isBm ? "bintang" : "star"}`}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      i <= activeRating ? "text-primary" : "text-white"
                    }`}
                    fill="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              ))}
            </div>
            {label && (
              <span className="text-sm font-semibold text-primary ml-1">{label}</span>
            )}
          </div>

          {/* Optional notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder={
              isBm
                ? "Kongsi pendapat anda (pilihan)..."
                : "Share your thoughts (optional)..."
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary resize-none transition-colors"
          />

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={!selected || status === "submitting"}
              className="btn-primary text-sm px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? (isBm ? "Menghantar..." : "Submitting...")
                : (isBm ? "Hantar Maklum Balas" : "Submit Feedback")}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-500">
                {isBm ? "Ralat. Sila cuba lagi." : "Something went wrong. Please try again."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
