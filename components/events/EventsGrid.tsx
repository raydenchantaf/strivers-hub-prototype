"use client";

import { useLanguage } from "@/context/LanguageContext";
import { urlFor, type SanityResource, type SanityCategory } from "@/lib/sanity";
import Link from "next/link";
import TagsRow from "@/components/ui/TagsRow";

const BADGE_CLASS = "bg-brand-orange/20 text-brand-orange";

interface Props {
  events: SanityResource[];
}

export default function EventsGrid({ events }: Props) {
  const { language } = useLanguage();

  if (events.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-4xl mb-3">📭</div>
        <p>
          {language === "bm"
            ? "Tiada acara buat masa ini."
            : "No events found at the moment."}
        </p>
      </div>
    );
  }

  function getImageSrc(item: SanityResource, width: number, height: number) {
    const src = (language === "bm" && item.image_bm) ? item.image_bm : item.image_en;
    return src
      ? urlFor(src).width(width).height(height).fit("crop").auto("format").url()
      : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80";
  }

  function getCats(item: SanityResource): SanityCategory[] {
    return Array.isArray(item.category) ? item.category : [];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {events.map((event) => {
        const title = language === "bm" ? event.title_bm : event.title_en;
        const cats  = getCats(event);

        return (
          <div key={event._id} className="card group hover:shadow-lg transition-shadow flex flex-col">
            {/* Image */}
            <Link href={`/resources/${event.slug.current}`} className="block aspect-video overflow-hidden">
              <img
                src={getImageSrc(event, 600, 338)}
                alt={(language === "bm" && event.image_bm ? event.image_bm : event.image_en)?.alt || title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <div className="p-5 flex flex-col flex-1">
              {/* Badges — draggable scrollable row */}
              <TagsRow cats={cats} language={language} badgeClass={BADGE_CLASS} />

              {/* Title */}
              <Link href={`/resources/${event.slug.current}`}>
                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors mb-2">
                  {title}
                </h3>
              </Link>

              {/* Excerpt — desktop only */}
              <div className="hidden sm:block mb-4">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {language === "bm" ? event.excerpt_bm : event.excerpt_en}
                </p>
              </div>

              {/* Spacer pushes CTA to bottom */}
              <div className="flex-1" />

              {/* CTA — pinned to bottom */}
              <Link
                href={`/resources/${event.slug.current}`}
                className="self-start inline-block rounded-full bg-primary text-white text-xs font-semibold px-6 py-1.5 border border-primary hover:bg-transparent hover:text-primary transition-colors"
              >
                {language === "bm" ? "Baca Lagi" : "Read More"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
