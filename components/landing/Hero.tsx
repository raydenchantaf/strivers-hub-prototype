"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-brand-rose overflow-hidden">
      <div className="container-max section-padding">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            {/* Eyebrow badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
              <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                🇲🇾 Made for Malaysia
              </span>
              <span className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-semibold text-primary">
                Mastercard Inclusive for Growth
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              {t("hero.headline")}
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              {t("hero.subtext")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/assessment" className="btn-primary text-base py-3.5 px-8">
                {t("hero.cta")}
              </Link>
              <Link href="#how-it-works" className="btn-outline text-base py-3.5 px-8">
                {t("hero.assessCta")}
              </Link>
            </div>
          </div>

          {/* Right: Image + floating stat card */}
          <div className="flex-1 relative w-full max-w-sm md:max-w-none mx-auto">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
                alt="Women entrepreneurs"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                🚀
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Community growing</p>
                <p className="text-sm font-bold text-gray-900">20,000+ Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </section>
  );
}
