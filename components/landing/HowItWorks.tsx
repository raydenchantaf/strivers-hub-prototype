"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  {
    number: "01",
    icon: "📋",
    titleKey: "how.step1.title",
    descKey: "how.step1.desc",
  },
  {
    number: "02",
    icon: "🎯",
    titleKey: "how.step2.title",
    descKey: "how.step2.desc",
  },
  {
    number: "03",
    icon: "🤝",
    titleKey: "how.step3.title",
    descKey: "how.step3.desc",
  },
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {t("how.title")}
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-dashed border-t-2 border-dashed border-primary/20 z-0 -translate-x-4" />
              )}

              <div className="card p-6 flex flex-col items-center text-center gap-4 relative z-10 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-brand-rose flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{t(step.titleKey)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/assessment" className="btn-primary text-base py-3.5 px-8">
            {t("assess.start")}
          </Link>
        </div>
      </div>
    </section>
  );
}
