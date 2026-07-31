"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col items-center text-center gap-5 py-4">

            {/* 404 visual */}
            <div className="text-7xl font-extrabold text-primary/10 leading-none select-none">
              404
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                {t("notfound.title")}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t("notfound.body")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Link
                href="/"
                className="flex-1 bg-accent text-white font-semibold px-8 py-3.5 rounded-full hover:bg-accent-hover transition-colors text-sm text-center"
              >
                {t("notfound.home")}
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
