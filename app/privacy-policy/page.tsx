"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  const sections = [
    { title: t("privacy.s1.title"), body: t("privacy.s1.body") },
    { title: t("privacy.s2.title"), body: t("privacy.s2.body") },
    { title: t("privacy.s3.title"), body: t("privacy.s3.body") },
    { title: t("privacy.s4.title"), body: t("privacy.s4.body") },
    { title: t("privacy.s5.title"), body: t("privacy.s5.body") },
    { title: t("privacy.s6.title"), body: t("privacy.s6.body") },
    { title: t("privacy.s7.title"), body: t("privacy.s7.body") },
    { title: t("privacy.s8.title"), body: t("privacy.s8.body") },
    { title: t("privacy.s9.title"), body: t("privacy.s9.body") },
  ];

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

          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            {t("privacy.intro")}
          </p>

          <div className="flex flex-col gap-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-base font-extrabold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              {t("privacy.placeholder")}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
