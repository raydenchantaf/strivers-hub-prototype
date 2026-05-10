"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function HowItWorks2() {
  const { t } = useLanguage();
  const { bumpReset } = useAssessmentReset();

  const steps = [
    {
      number: "1",
      title: t("how2.step1.title"),
      description: (
        <>
          {t("how2.step1.pre")}{" "}
          <strong className="font-semibold text-gray-800">{t("how2.step1.bold")}</strong>{" "}
          {t("how2.step1.post")}
        </>
      ),
    },
    {
      number: "2",
      title: t("how2.step2.title"),
      description: t("how2.step2.desc"),
    },
    {
      number: "3",
      title: t("how2.step3.title"),
      description: t("how2.step3.desc"),
    },
  ];

  return (
    <section className="how-it-works-padding bg-white">
      <div className="container-max flex flex-col gap-6">

        {/* Top split card */}
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm">

          {/* Left: photo */}
          <div className="relative flex-1 min-h-[260px] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
              alt="Women entrepreneurs collaborating"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: content */}
          <div className="relative flex-1 bg-[#B12069] flex flex-col justify-center gap-6 px-8 py-10 md:px-12 md:py-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-36 h-36 rounded-full bg-white/10 translate-y-1/3 pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight relative z-10 whitespace-pre-line">
              {t("how2.card.headline")}
            </h2>

            <p className="text-white/90 text-base leading-relaxed relative z-10">
              {t("how2.card.body")}
            </p>

            <div className="relative z-10">
              <Link
                href="/assessment"
                onClick={bumpReset}
                className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#B12069] transition-colors duration-200"
              >
                {t("how2.card.cta")} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom 3-step strip */}
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-7 md:px-10 md:py-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4 py-5 md:py-0 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#B12069] flex items-center justify-center text-white font-extrabold text-lg">
                {step.number}
              </div>
              <div>
                <p className="font-bold text-[#B12069] mb-1 leading-snug">{step.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
