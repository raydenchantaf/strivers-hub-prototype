"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero2() {
  const { t } = useLanguage();

  return (
    <section className="relative hero-padding overflow-hidden">
      <div className="container-max section-padding py-2 px-4 md:px-8 mx-auto flex flex-col items-start text-left gap-4">

        <h1 className="font-extrabold text-[clamp(40px,6vw,58px)] text-[#B12069] leading-[1.05em] whitespace-pre-line">
          {t("hero2.headline")}
        </h1>

        <p className="max-w-2xl font-light text-[clamp(16px,2vw,20px)] text-black leading-[1.25em]">
          {t("hero2.subtext")}
        </p>

        <div className="flex items-center gap-6 mt-2">
          <Image
            src="/logo.svg"
            alt="Strivers Hub"
            width={186}
            height={55}
            className="object-contain"
          />
          <div className="h-10 w-px bg-gray-300" />
          <Image
            src="/MyDigital.png"
            alt="MyDigital"
            width={180}
            height={56}
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
}
