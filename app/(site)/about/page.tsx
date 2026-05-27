"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const { bumpReset } = useAssessmentReset();

  const pillars = [
    {
      number: "01",
      title: t("about.pillar1.title"),
      desc:  t("about.pillar1.desc"),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: t("about.pillar2.title"),
      desc:  t("about.pillar2.desc"),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: t("about.pillar3.title"),
      desc:  t("about.pillar3.desc"),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4h-1M9 20H4v-2a4 4 0 0 1 4-4h1m4 6v-2m0 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm16 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      ),
    },
  ];

  const whyPoints = [
    t("about.why.1"),
    t("about.why.2"),
    t("about.why.3"),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose">

      {/* ── Hero header ── */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
            {t("about.title")}
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            {t("about.org")}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            {t("about.tagline")}
          </p>
        </div>
      </div>

      {/* ── Intro section ── */}
      <section className="container-max section-padding py-14">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">

          {/* Image side */}
          <div className="relative flex-1 min-h-[260px] md:min-h-0">
            <img
              src="/about_us.webp"
              alt="Women entrepreneurs"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content side */}
          <div className="flex-1 flex flex-col justify-center gap-5 px-8 py-10 md:px-12 md:py-14">
            <div className="flex items-center gap-4">
              <Image src="/logo.svg" alt="Strivers Hub" width={140} height={42} className="object-contain" />
              <div className="h-8 w-px bg-gray-200" />
              <Image src="/CFIG.png" alt="Mastercard Center for Inclusive Growth" width={140} height={40} className="object-contain" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
              {t("about.hero.headline")}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t("about.hero.body")}
            </p>
            <div>
              <Link
                href="/assessment"
                onClick={bumpReset}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors text-sm"
              >
                {t("about.hero.cta")} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why section ── */}
      <section className="bg-white">
        <div className="container-max section-padding py-14">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10">
            {t("about.why.title")}
          </h2>
          <div className="flex flex-col gap-4">
            {whyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-2xl px-6 py-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B12069] text-white text-sm font-extrabold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission banner ── */}
      <section className="bg-[#B12069]">
        <div className="container-max section-padding py-12 text-center">
          <p className="text-white text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            {t("about.mission")}
          </p>
        </div>
      </section>

      {/* ── Three pillars ── */}
      <section className="container-max section-padding py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.number} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#B12069] flex items-center justify-center flex-shrink-0">
                  {p.icon}
                </div>
                <span className="text-3xl font-extrabold text-gray-300 leading-none">{p.number}</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
