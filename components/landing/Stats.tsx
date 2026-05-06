"use client";

import { useLanguage } from "@/context/LanguageContext";

const stats = [
  { value: "40+", labelKey: "stats.programs", icon: "🏆" },
  { value: "20,000+", labelKey: "stats.entrepreneurs", icon: "👩‍💼" },
  { value: "98%", labelKey: "stats.satisfaction", icon: "⭐" },
];

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                Our Impact
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {t("stats.title")}
              <span className="block text-primary mt-1">{t("stats.subtitle")}</span>
            </h2>
          </div>

          {/* Right: Stat cards */}
          <div className="flex-1 grid grid-cols-3 gap-4 w-full">
            {stats.map((stat) => (
              <div
                key={stat.labelKey}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs md:text-sm font-medium">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
