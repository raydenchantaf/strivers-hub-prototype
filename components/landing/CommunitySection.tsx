"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { communityEvents } from "@/data/resources";

export default function CommunitySection() {
  const { t, language } = useLanguage();

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {t("community.title")}
          </h2>
          <Link href="#" className="text-primary font-semibold text-sm hover:underline">
            {t("community.viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {communityEvents.map((event) => (
            <div
              key={event.id}
              className="card group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Event
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1.5">
                  {new Date(event.date).toLocaleDateString(language === "bm" ? "ms-MY" : "en-MY", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary transition-colors">
                  {event.title[language]}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
