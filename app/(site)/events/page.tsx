"use client";

import { useLanguage } from "@/context/LanguageContext";
import { communityEvents } from "@/data/resources";

export default function EventsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            {t("events.title")}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            {t("events.subtitle")}
          </p>
        </div>
      </div>

      <div className="container-max section-padding">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {communityEvents.map((event) => (
            <div key={event.id} className="card group hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-1.5">
                  {new Date(event.date).toLocaleDateString(
                    language === "bm" ? "ms-MY" : "en-MY",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>

                <h3 className="font-bold text-gray-900 text-sm mb-4 leading-snug group-hover:text-primary transition-colors">
                  {event.title[language]}
                </h3>

                <button className="text-primary font-semibold text-xs hover:underline">
                  {t("events.readMore")} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {communityEvents.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>{t("events.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
