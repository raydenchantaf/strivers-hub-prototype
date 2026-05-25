"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityResource, type SanityCategory } from "@/lib/sanity";
import Link from "next/link";

const BADGE_CLASS = "bg-brand-orange/20 text-brand-orange uppercase";

interface Props {
  resources:  SanityResource[];
  categories: SanityCategory[];
}

export default function ResourcesGrid({ resources, categories }: Props) {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Only surface categories that have at least one article
  const usedValues = new Set(
    resources.flatMap((r) =>
      Array.isArray(r.category) ? r.category.map((c) => c.value) : []
    )
  );
  const visibleCategories = categories.filter((c) => usedValues.has(c.value));

  const filtered =
    activeFilter === "all"
      ? resources
      : resources.filter((r) =>
          Array.isArray(r.category) &&
          r.category.some((c) => c.value === activeFilter)
        );

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {/* "All" tab */}
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeFilter === "all"
              ? "bg-primary text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
          }`}
        >
          {language === "bm" ? "Semua" : "All"}
        </button>

        {visibleCategories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveFilter(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === cat.value
                ? "bg-primary text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {language === "bm" ? cat.title_bm : cat.title_en}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((article) => {
            const title   = language === "bm" ? article.title_bm   : article.title_en;
            const excerpt = language === "bm" ? article.excerpt_bm : article.excerpt_en;
            const cats: SanityCategory[] = Array.isArray(article.category) ? article.category : [];
            const activeImage = language === "bm"
              ? (article.image_bm ?? article.image_en)
              : (article.image_en ?? article.image_bm);
            const imgSrc = activeImage
              ? urlFor(activeImage).width(600).height(338).fit("crop").auto("format").url()
              : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80";

            return (
              <div key={article._id} className="card group hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={activeImage?.alt || title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  {/* Category badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cats.map((cat) => (
                      <span
                        key={cat._id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_CLASS}`}
                      >
                        {language === "bm" ? cat.title_bm : cat.title_en}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mb-1.5">
                    {new Date(article.publishedAt).toLocaleDateString(
                      language === "bm" ? "ms-MY" : "en-MY",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>

                  <Link href={`/resources/${article.slug.current}`}>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </Link>
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
