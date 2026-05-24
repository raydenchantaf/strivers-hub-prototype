"use client";

import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityCategory, type SanityResource } from "@/lib/sanity";

const BADGE_CLASS = "bg-primary/10 text-primary";

interface Props {
  title_en: string;
  title_bm: string;
  category: SanityCategory[];
  publishedAt: string;
  image_en?: SanityResource["image_en"];
  image_bm?: SanityResource["image_bm"];
}

export default function ArticleHeader({
  title_en,
  title_bm,
  category,
  publishedAt,
  image_en,
  image_bm,
}: Props) {
  const { language } = useLanguage();

  const isBm     = language === "bm";
  const title    = isBm ? title_bm : title_en;
  const subtitle = isBm ? title_en : title_bm;
  const cats: SanityCategory[] = Array.isArray(category) ? category : [];

  // Pick the language-appropriate image, fall back to the other if unavailable
  const activeImage = isBm ? (image_bm ?? image_en) : (image_en ?? image_bm);
  const coverSrc = activeImage
    ? urlFor(activeImage).width(900).auto("format").url()
    : null;

  const formattedDate = new Date(publishedAt).toLocaleDateString(
    isBm ? "ms-MY" : "en-MY",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <>
      {/* Cover image — language-aware */}
      {coverSrc && (
        <div className="w-full rounded-xl overflow-hidden mb-8">
          <img
            src={coverSrc}
            alt={activeImage?.alt || title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {cats.map((cat) => (
          <span
            key={cat._id}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_CLASS}`}
          >
            {isBm ? cat.title_bm : cat.title_en}
          </span>
        ))}
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
