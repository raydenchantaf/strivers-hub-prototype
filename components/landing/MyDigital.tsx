"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function MyDigital() {
  const { t } = useLanguage();

  return (
    <section className="landing-mydigital-padding bg-white">
      <div className="container-max">
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-[#822B62] min-h-[480px]">

          {/* Left: content — below image on mobile, left on desktop */}
          <div className="order-2 md:order-1 flex-1 bg-white flex flex-col justify-center gap-6 px-8 py-10 md:px-14 md:py-14">

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#822B62] leading-tight">
              {t("mydigital.headline")}
            </h2>

            <p className="text-gray-600 text-base leading-relaxed max-w-md">
              {t("mydigital.body")}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {/* CTA Button */}
              <a
                href="https://rakyatdigital.gov.my"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#B12069] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#822B62] transition-colors duration-200 whitespace-nowrap"
              >
                {t("mydigital.cta")} &rarr;
              </a>

              {/* Rakyat Digital logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/RakyatDigital.icon.png"
                  alt="Rakyat Digital — Kementerian Digital"
                  width={160}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right: photo — on top on mobile, right on desktop */}
          <div className="order-1 md:order-2 relative flex-1 min-h-[260px] md:min-h-0">
            <Image
              src="/mydigital.webp"
              alt="Woman exploring digital opportunities"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
