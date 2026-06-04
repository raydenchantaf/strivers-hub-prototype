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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex items-start justify-center section-padding py-16">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={t("login.password.placeholder")}
                  className={inputClass + " pr-11"}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
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
