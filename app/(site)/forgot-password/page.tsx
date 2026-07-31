"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res  = await fetch("/api/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        setError(t("forgot.error.generic"));
        setStatus("idle");
      }
    } catch {
      setError(t("forgot.error.generic"));
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose flex items-start justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

          {status === "success" ? (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              {/* Envelope icon */}
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {t("forgot.success.heading")}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t("forgot.success.description")}
                </p>
              </div>
              <Link
                href="/login"
                className="mt-2 text-sm text-accent font-semibold hover:underline"
              >
                ← {t("forgot.backToLogin")}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {t("forgot.heading")}
                </h1>
                <div className="w-12 h-1 bg-accent rounded-full mt-3" />
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  {t("forgot.description")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className={labelClass}>
                    {t("forgot.email")} <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder={t("forgot.email.placeholder")}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-accent text-white font-semibold py-3.5 rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? t("forgot.submitting") : t("forgot.submit")}
                </button>

                <p className="text-center text-sm text-gray-500">
                  <Link href="/login" className="text-accent font-semibold hover:underline">
                    ← {t("forgot.backToLogin")}
                  </Link>
                </p>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
