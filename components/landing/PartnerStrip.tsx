"use client";

import { useLanguage } from "@/context/LanguageContext";

const partners = [
  { name: "Maybank", logo: "🏦" },
  { name: "MDEC", logo: "💻" },
  { name: "SME Corp", logo: "🏢" },
  { name: "TEKUN", logo: "📊" },
  { name: "Cradle", logo: "🚀" },
  { name: "MARA", logo: "🌟" },
];

export default function PartnerStrip() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-gray-50 py-12">
      <div className="container-max">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {t("partners.title")}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{t("partners.subtitle")}</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xl">{p.logo}</span>
              <span className="font-semibold text-gray-700 text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
