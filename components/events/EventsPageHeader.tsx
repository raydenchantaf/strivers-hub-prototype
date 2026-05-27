"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function EventsPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
      <div className="container-max text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
          {t("events.title")}
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
          {t("events.subtitle")}
        </p>
      </div>
    </div>
  );
}
