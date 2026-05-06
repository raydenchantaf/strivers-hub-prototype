"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { resources } from "@/data/resources";

const categoryColors: Record<string, string> = {
  finance: "bg-emerald-100 text-emerald-700",
  digital: "bg-blue-100 text-blue-700",
  marketing: "bg-purple-100 text-purple-700",
  legal: "bg-orange-100 text-orange-700",
};

export default function InsightsGrid() {
  const { t, language } = useLanguage();
  const preview = resources.slice(0, 3);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {t("insights.title")}
          </h2>
          <Link href="/resources" className="text-primary font-semibold text-sm hover:underline">
            {t("insights.viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {preview.map((article) => (
            <div key={article.id} className="card group hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      categoryColors[article.category]
                    }`}
                  >
                    {t(`resources.${article.category}`)}
                  </span>
                  <span className="text-xs text-gray-400">{article.readTime} min read</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
                  {article.title[language]}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                  {article.excerpt[language]}
                </p>
                <Link
                  href="/resources"
                  className="text-primary font-semibold text-xs hover:underline"
                >
                  {t("insights.readMore")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
