"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAssessmentReset } from "@/context/AssessmentResetContext";

export default function HowItWorks2() {
  const { t } = useLanguage();
  const { bumpReset } = useAssessmentReset();

  return (
    <section className="how-it-works-padding">
      <div className="container-max flex flex-col gap-6">

        {/* Top split card */}
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[480px]">

          {/* Left: photo */}
          <div className="relative flex-1 min-h-[260px] md:min-h-0">
            <Image
              src="/hero.image.webp"
              alt="Women entrepreneurs collaborating"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: content */}
          <div className="relative flex-1 how-it-works-bg flex flex-col justify-center gap-6 px-8 py-10 md:px-12 md:py-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-36 h-36 rounded-full bg-white/10 translate-y-1/3 pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight relative z-10 whitespace-pre-line">
              {t("how.card.headline")}
            </h2>

            <p className="text-white/90 text-base leading-relaxed relative z-10">
              {t("how.card.body")}
            </p>

            <div className="how-it-works-cta relative z-10">
              <Link
                href="/assessment"
                onClick={bumpReset}
                className="inline-flex items-center gap-2  text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-accent transition-colors duration-200"
              >
                {t("how.card.cta")} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom 3-step strip */}
        <div className="steps-wrap rounded-2xl border border-primary bg-white px-6 py-7 md:px-10 md:py-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary">

          {/* Step 1 */}
          <div className="flex items-start gap-4 py-5 md:py-0 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
            <div className="step-1 flex-shrink-0 w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white font-extrabold text-lg">
              1
            </div>
            <div>
              <p className="font-bold text-accent mb-1 leading-snug">{t("how.step1.title")}</p>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("how.step1.desc") }}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 py-5 md:py-0 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
            <div className="step-2 flex-shrink-0 w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white font-extrabold text-lg">
              2
            </div>
            <div>
              <p className="font-bold text-accent mb-1 leading-snug">{t("how.step2.title")}</p>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("how.step2.desc") }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 py-5 md:py-0 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
            <div className="step-3 flex-shrink-0 w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white font-extrabold text-lg">
              3
            </div>
            <div>
              <p className="font-bold text-accent mb-1 leading-snug">{t("how.step3.title")}</p>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("how.step3.desc") }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
