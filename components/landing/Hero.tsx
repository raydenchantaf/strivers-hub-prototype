"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero2() {
  const { t } = useLanguage();

  return (
    <section className="relative hero-padding overflow-hidden">
      <div className="container-max section-padding py-2 px-4 md:px-8 mx-auto flex flex-col items-start text-left gap-4">

        <h1 className="font-extrabold text-[clamp(40px,6vw,58px)] text-[#822B62] leading-[1.05em] whitespace-pre-line">
          {t("hero.headline")}
        </h1>

        <p className="max-w-2xl font-light text-[clamp(16px,2vw,20px)] text-black leading-[1.25em]">
          {t("hero.subtext")}
        </p>

        

      </div>
    </section>
  );
}
