"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { resources, ResourceCategory } from "@/data/resources";

const categoryColors: Record<string, string> = {
  finance: "bg-emerald-100 text-emerald-700",
  digital: "bg-blue-100 text-blue-700",
  marketing: "bg-purple-100 text-purple-700",
  legal: "bg-orange-100 text-orange-700",
};

type Filter = "all" | ResourceCategory;

export default function ResourcesPage() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filters: Filter[] = ["all", "finance", "digital", "marketing", "legal"];

  const filtered =
    activeFilter === "all"
      ? resources
      : resources.filter((r) => r.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            {t("resources.title")}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            {t("resources.subtitle")}
          </p>
        </div>
      </div>

      <div className="container-max section-padding">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {t(`resources.${f}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((article) => (
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

                <p className="text-xs text-gray-400 mb-1.5">
                  {new Date(article.date).toLocaleDateString(
                    language === "bm" ? "ms-MY" : "en-MY",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>

                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
                  {article.title[language]}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {article.excerpt[language]}
                </p>

                <button className="text-primary font-semibold text-xs hover:underline">
                  {t("insights.readMore")} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No resources found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
