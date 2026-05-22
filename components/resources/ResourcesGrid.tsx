"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityResource, type ResourceCategory } from "@/lib/sanity";
import Link from "next/link";

const categoryColors: Record<string, string> = {
  finance:    "bg-emerald-100 text-emerald-700",
  digital:    "bg-blue-100    text-blue-700",
  marketing:  "bg-purple-100  text-purple-700",
  legal:      "bg-orange-100  text-orange-700",
  mentorship: "bg-pink-100    text-pink-700",
  grants:     "bg-yellow-100  text-yellow-700",
};

type Filter = "all" | ResourceCategory;

const ALL_FILTERS: Filter[] = [
  "all", "finance", "digital", "marketing", "legal", "mentorship", "grants",
];

const filterLabels: Record<Filter, { en: string; bm: string }> = {
  all:        { en: "All",        bm: "Semua" },
  finance:    { en: "Finance",    bm: "Kewangan" },
  digital:    { en: "Digital",    bm: "Digital" },
  marketing:  { en: "Marketing",  bm: "Pemasaran" },
  legal:      { en: "Legal",      bm: "Undang-undang" },
  mentorship: { en: "Mentorship", bm: "Bimbingan" },
  grants:     { en: "Grants",     bm: "Geran" },
};

interface Props {
  resources: SanityResource[];
}

export default function ResourcesGrid({ resources }: Props) {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  // Only show filters that have at least one article (plus "All")
  const usedCategories = new Set(resources.map((r) => r.category));
  const visibleFilters = ALL_FILTERS.filter(
    (f) => f === "all" || usedCategories.has(f as ResourceCategory)
  );

  const filtered =
    activeFilter === "all"
      ? resources
      : resources.filter((r) => r.category === activeFilter);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {visibleFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === f
                ? "bg-primary text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {filterLabels[f][language]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((article) => {
            const title   = language === "bm" ? article.title_bm   : article.title_en;
            const excerpt = language === "bm" ? article.excerpt_bm : article.excerpt_en;
            const imgSrc  = article.image
              ? urlFor(article.image).width(600).height(338).fit("crop").auto("format").url()
              : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80";

            return (
              <div key={article._id} className="card group hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={article.image?.alt || title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {filterLabels[article.category as Filter]?.[language] ?? article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readTime} min read</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-1.5">
                    {new Date(article.publishedAt).toLocaleDateString(
                      language === "bm" ? "ms-MY" : "en-MY",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>

                  <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    {excerpt}
                  </p>

                  <Link
                    href={`/resources/${article.slug.current}`}
                    className="text-primary font-semibold text-xs hover:underline"
                  >
                    {language === "bm" ? "Baca Lagi" : "Read More"} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>
            {language === "bm"
              ? "Tiada sumber dalam kategori ini buat masa ini."
              : "No resources found in this category yet."}
          </p>
        </div>
      )}
    </>
  );
}
