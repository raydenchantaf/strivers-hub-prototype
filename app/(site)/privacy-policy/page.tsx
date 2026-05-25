"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
            {t("privacy.label")}
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            {t("privacy.title")}
          </h1>
          <p className="text-white/70 text-sm">
            {t("privacy.effectiveDate")}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="container-max section-padding py-14 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <div
            className="
              text-gray-500 text-sm leading-relaxed
              [&_h2]:text-base [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2:first-child]:mt-0
              [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
              [&_li]:mb-1
              [&_strong]:text-gray-700
              [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80
            "
            dangerouslySetInnerHTML={{ __html: t("privacy.body") }}
          />

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              {t("privacy.footer")}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
