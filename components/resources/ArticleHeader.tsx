"use client";

import { useLanguage } from "@/context/LanguageContext";

const categoryColors: Record<string, string> = {
  finance:    "bg-emerald-100 text-emerald-700",
  digital:    "bg-blue-100    text-blue-700",
  marketing:  "bg-purple-100  text-purple-700",
  legal:      "bg-orange-100  text-orange-700",
  mentorship: "bg-pink-100    text-pink-700",
  grants:     "bg-yellow-100  text-yellow-700",
};

const categoryLabels: Record<string, { en: string; bm: string }> = {
  finance:    { en: "Finance",    bm: "Kewangan" },
  digital:    { en: "Digital",    bm: "Digital" },
  marketing:  { en: "Marketing",  bm: "Pemasaran" },
  legal:      { en: "Legal",      bm: "Undang-undang" },
  mentorship: { en: "Mentorship", bm: "Bimbingan" },
  grants:     { en: "Grants",     bm: "Geran" },
};

interface Props {
  title_en: string;
  title_bm: string;
  category: string;
  readTime: number;
  publishedAt: string;
}

export default function ArticleHeader({
  title_en,
  title_bm,
  category,
  readTime,
  publishedAt,
}: Props) {
  const { language } = useLanguage();

  const isBm     = language === "bm";
  const title    = isBm ? title_bm : title_en;
  const subtitle = isBm ? title_en : title_bm;
  const catLabel = categoryLabels[category]?.[language] ?? category;

  const formattedDate = new Date(publishedAt).toLocaleDateString(
    isBm ? "ms-MY" : "en-MY",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <>
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
            categoryColors[category] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {catLabel}
        </span>
        <span className="text-xs text-gray-400">
          {readTime} {isBm ? "min baca" : "min read"}
        </span>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
        {title}
      </h1>

      {/* Subtitle — the other language */}
      <p className="text-base text-gray-400 italic mb-6">{subtitle}</p>

      <hr className="border-gray-200 mb-8" />
    </>
  );
}
