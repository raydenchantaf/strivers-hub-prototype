"use client";

import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityResource } from "@/lib/sanity";
import Link from "next/link";

const BADGE_CLASS = "bg-brand-orange/20 text-brand-orange";

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  items: SanityResource[];
}

export default function FinancingGrid({ items }: Props) {
  const { language } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-4xl mb-3">📭</div>
        <p>
          {language === "bm"
            ? "Tiada maklumat pembiayaan buat masa ini."
            : "No financing resources found at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {items.map((article) => {
        const title   = language === "bm" ? article.title_bm   : article.title_en;
        const excerpt = language === "bm" ? article.excerpt_bm : article.excerpt_en;
        const imgSrc  = article.image_en
          ? urlFor(article.image_en).width(600).height(338).fit("crop").auto("format").url()
          : "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80";

        return (
          <div key={article._id} className="card group hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img
                src={imgSrc}
                alt={article.image_en?.alt || title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              {/* Category badges */}
              {Array.isArray(article.category) && article.category.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.category.map((cat) => (
                    <span
                      key={cat._id}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_CLASS}`}
                    >
                      {toTitleCase(language === "bm" ? cat.title_bm : cat.title_en)}
                    </span>
                  ))}
                </div>
              )}

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
  );
}
