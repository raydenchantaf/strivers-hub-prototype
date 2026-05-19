"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function MentorshipPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const benefits = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h4" />
        </svg>
      ),
      title: t("mentorship.benefit1.title"),
      desc: t("mentorship.benefit1.desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4 6v-2m0 0a4 4 0 100-8 4 4 0 000 8zm-8-6a4 4 0 100-8 4 4 0 000 8zm16 0a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
      title: t("mentorship.benefit2.title"),
      desc: t("mentorship.benefit2.desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: t("mentorship.benefit3.title"),
      desc: t("mentorship.benefit3.desc"),
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStatus("submitting");
    try {
      await fetch("/api/submit-mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
            {t("mentorship.title")}
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 whitespace-pre-line">
            {t("mentorship.tagline")}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t("mentorship.body")}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <section className="container-max section-padding py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#B12069] flex items-center justify-center flex-shrink-0">
                {b.icon}
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="bg-white">
        <div className="container-max section-padding py-14">
          <div className="flex flex-col md:flex-row gap-10 items-stretch">

            {/* Left: image */}
            <div className="flex-1 rounded-3xl overflow-hidden min-h-[360px] relative hidden md:block">
              <img
                src="mentorship.image.png"
                alt="Women mentorship"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: form */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  {t("mentorship.form.title")}
                </h2>
                <div className="w-12 h-1 bg-[#B12069] rounded-full mt-3" />
                <p className="text-gray-500 text-sm leading-relaxed mt-4">
                  {t("mentorship.form.subtitle")}
                </p>
              </div>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-800 font-semibold text-lg">{t("mentorship.form.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("mentorship.form.name")} <span className="text-[#B12069]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("mentorship.form.name.placeholder")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("mentorship.form.email")} <span className="text-[#B12069]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t("mentorship.form.email.placeholder")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("mentorship.form.phone")} <span className="text-[#B12069]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t("mentorship.form.phone.placeholder")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">{t("mentorship.form.error")}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#B12069] text-white font-semibold py-3.5 rounded-xl hover:bg-[#8f1a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  {status === "submitting"
                    ? t("mentorship.form.submitting")
                    : t("mentorship.form.submit")}
                </button>

                {status === "error" && (
                  <p className="text-red-500 text-sm">{t("mentorship.form.error")}</p>
                )}
              </form>
            )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
