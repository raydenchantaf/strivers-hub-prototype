"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 visual */}
        <div className="text-8xl font-extrabold text-primary/10 leading-none mb-2 select-none">
          404
        </div>

        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6" />

        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          {t("notfound.title")}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {t("notfound.body")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary py-3 px-6">
            {t("notfound.home")}
          </Link>
          <Link href="/assessment" className="btn-outline py-3 px-6">
            {t("notfound.assess")}
          </Link>
        </div>
      </div>
    </div>
  );
}
