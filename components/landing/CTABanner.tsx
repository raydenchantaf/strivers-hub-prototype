"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CTABanner() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-gradient-to-r from-primary to-primary-dark py-16">
      <div className="container-max text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">💪</div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-6">
            {t("cta.title")}
          </h2>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-brand-rose transition-colors shadow-lg text-base"
          >
            {t("cta.button")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
