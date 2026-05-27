"use client";

import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityCategory, type SanityResource } from "@/lib/sanity";

const BADGE_CLASS = "bg-brand-orange/20 text-brand-orange";

/** Converts any casing to Title Case — e.g. "CUSTOMER RETENTION" → "Customer Retention" */
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

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

  const isBm  = language === "bm";
  const title = isBm ? title_bm : title_en;
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
      <div className="mb-4">
        {/* Category badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          {cats.map((cat) => (
            <span
              key={cat._id}
              className={`text-sm font-semibold px-2.5 py-1 rounded-full ${BADGE_CLASS}`}
            >
              {toTitleCase(isBm ? cat.title_bm : cat.title_en)}
            </span>
          ))}
        </div>
        {/* Date — on its own line below badges */}
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
        {title}
      </h1>

      <hr className="border-gray-200 mb-8" />
    </>
  );
}
