"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function validatePassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);
}

export default function RegisterPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);

    if (!validatePassword(form.password)) {
      setFieldError(t("register.error.passwordWeak"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFieldError(t("register.error.passwordMismatch"));
      return;
    }

    setStatus("submitting");
    try {
      await fetch("/api/submit-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        }),
      });
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("register.heading")}
            </h1>
            <div className="w-12 h-1 bg-[#B12069] rounded-full mt-3" />
          </div>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-800 font-semibold text-lg">{t("register.success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("register.firstName")} <span className="text-[#B12069]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    placeholder={t("register.firstName.placeholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("register.lastName")} <span className="text-[#B12069]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder={t("register.lastName.placeholder")}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  {t("register.email")} <span className="text-[#B12069]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={t("register.email.placeholder")}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  {t("register.phone")} <span className="text-[#B12069]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder={t("register.phone.placeholder")}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>
                  {t("register.password")} <span className="text-[#B12069]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={t("register.password.placeholder")}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1.5">{t("register.password.hint")}</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>
                  {t("register.confirmPassword")} <span className="text-[#B12069]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder={t("register.confirmPassword.placeholder")}
                  className={inputClass}
                />
              </div>

              {/* Field / submission errors */}
              {fieldError && (
                <p className="text-red-500 text-sm">{fieldError}</p>
              )}
              {status === "error" && !fieldError && (
                <p className="text-red-500 text-sm">{t("register.error")}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#B12069] text-white font-semibold py-3.5 rounded-full hover:bg-[#8f1a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {status === "submitting" ? t("register.submitting") : t("register.submit")}
              </button>

              {/* Login link */}
              <p className="text-center text-sm text-gray-500">
                {t("register.hasAccount")}{" "}
                <Link href="/login" className="text-[#B12069] font-semibold hover:underline">
                  {t("register.loginLink")}
                </Link>
              </p>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
