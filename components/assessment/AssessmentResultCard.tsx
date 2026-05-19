"use client";

import { useEffect, useState } from "react";
import { ScoreTier } from "@/data/questions";

// ── Animated score ring ──────────────────────────────────────────────────────
const SIZE         = 180;
const STROKE       = 10;
const RADIUS       = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset]       = useState(CIRCUMFERENCE);

  useEffect(() => {
    const duration = 1500;
    const start    = performance.now();

    function tick(now: number) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);

      setDisplayed(Math.round(eased * score));
      setOffset(CIRCUMFERENCE - eased * (score / maxScore) * CIRCUMFERENCE);

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [score, maxScore]);

  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#FFE0CC" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none"
          stroke="#FF7000"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "none" }}
        />
      </svg>
      <div className="relative flex flex-col items-center leading-none">
        <span className="text-3xl font-extrabold text-gray-900">{displayed}</span>
        <span className="text-xs text-gray-400 mt-1">/ {maxScore}</span>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  score:    number;
  maxScore: number;
  tier:     ScoreTier;
  language: "en" | "bm";
}

export default function AssessmentResultCard({ score, maxScore, tier, language }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

        {/* Score ring + category badge */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <ScoreRing score={score} maxScore={maxScore} />
          <span className="text-sm font-bold px-3 py-1 rounded-full text-white bg-brand-orange">
            {tier.category[language]}
          </span>
        </div>

        {/* Label + description + next steps */}
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
                <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold bg-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
