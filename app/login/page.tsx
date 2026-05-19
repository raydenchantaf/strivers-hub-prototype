"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(
          data.error === "INVALID_CREDENTIALS"
            ? t("login.error.invalid")
            : t("login.error.generic")
        );
        setStatus("idle");
      }
    } catch {
      setError(t("login.error.generic"));
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

          <div className="mb-8">
            <p className="text-sm font-semibold text-[#B12069] uppercase tracking-widest mb-1">
              {t("login.welcome")}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("login.heading")}
            </h1>
            <div className="w-12 h-1 bg-[#B12069] rounded-full mt-3" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div>
              <label className={labelClass}>
                {t("login.email")} <span className="text-[#B12069]">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={t("login.email.placeholder")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t("login.password")} <span className="text-[#B12069]">*</span>
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={t("login.password.placeholder")}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1.5">{t("login.password.hint")}</p>
            </div>

            <div className="flex justify-end -mt-2">
              <a
                href="https://strivershub.com/en/auth/forgot-password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#B12069] font-semibold hover:underline"
              >
                {t("login.forgotPassword")}
              </a>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-[#B12069] text-white font-semibold py-3.5 rounded-full hover:bg-[#8f1a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? t("login.submitting") : t("login.submit")}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-[#B12069] font-semibold hover:underline">
                {t("login.registerLink")}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
