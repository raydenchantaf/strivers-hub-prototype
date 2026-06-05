"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AccountDeletedPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col items-center text-center gap-5 py-4">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                {t("account.deleted.heading")}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t("account.deleted.description")}
              </p>
            </div>

            <Link
              href="/"
              className="mt-2 inline-block bg-[#B12069] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#8f1a54] transition-colors text-sm"
            >
              {t("account.deleted.cta")}
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
