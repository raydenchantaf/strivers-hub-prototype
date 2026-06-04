"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
  const { t }          = useLanguage();
  const searchParams   = useSearchParams();
  const token          = searchParams.get("token") ?? "";

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t("reset.error.weak"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("reset.error.mismatch"));
      return;
    }

    setStatus("submitting");
    try {
      const res  = await fetch("/api/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else if (data.error === "INVALID_TOKEN" || data.error === "EXPIRED_TOKEN") {
        setError(t("reset.error.invalid"));
        setStatus("idle");
      } else {
        setError(t("reset.error.generic"));
        setStatus("idle");
      }
    } catch {
      setError(t("reset.error.generic"));
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  if (!token) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <p className="text-red-500 text-sm">{t("reset.error.invalid")}</p>
        <Link href="/forgot-password" className="text-[#B12069] font-semibold text-sm hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      {status === "success" ? (
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <div className="w-16 h-16 rounded-full bg-[#B12069]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#B12069]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              {t("reset.success.heading")}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("reset.success.description")}
            </p>
          </div>
          <Link
            href="/login"
            className="mt-2 inline-block bg-[#B12069] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#8f1a54] transition-colors text-sm"
          >
            {t("reset.loginLink")}
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("reset.heading")}
            </h1>
            <div className="w-12 h-1 bg-[#B12069] rounded-full mt-3" />
            <p className="text-sm text-gray-500 mt-4">{t("reset.description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>
                {t("reset.password")} <span className="text-[#B12069]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder={t("reset.password.placeholder")}
                  className={inputClass + " pr-11"}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{t("reset.password.hint")}</p>
            </div>

            <div>
              <label className={labelClass}>
                {t("reset.confirmPassword")} <span className="text-[#B12069]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder={t("reset.confirmPassword.placeholder")}
                  className={inputClass + " pr-11"}
                />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
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
              {status === "submitting" ? t("reset.submitting") : t("reset.submit")}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
