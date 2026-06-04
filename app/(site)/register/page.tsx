"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function validatePassword(pw: string): boolean {
  return pw.length >= 8;
}

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      // Step 1: Register
      const regRes = await fetch("/api/submit-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          password:  form.password,
        }),
      });
      const regData = await regRes.json();

      if (!regData.success) {
        if (regData.error === "EMAIL_EXISTS") {
          setFieldError(t("register.error.emailExists"));
        } else {
          setFieldError(t("register.error"));
        }
        setStatus("idle");
        return;
      }

      // Step 2: Auto-login
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();

      if (!loginData.success) {
        // Registration worked but login failed — send to login page with a message
        router.push("/login?registered=1");
        return;
      }

      router.push("/dashboard");
    } catch {
      setFieldError(t("register.error"));
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#B12069] focus:ring-1 focus:ring-[#B12069] transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center section-padding py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("register.heading")}
            </h1>
            <div className="w-12 h-1 bg-[#B12069] rounded-full mt-3" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("register.firstName")} <span className="text-[#B12069]">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder={t("register.firstName.placeholder")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("register.lastName")} <span className="text-[#B12069]">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder={t("register.lastName.placeholder")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register.email")} <span className="text-[#B12069]">*</span></label>
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("register.email.placeholder")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>{t("register.phone")} <span className="text-[#B12069]">*</span></label>
              <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("register.phone.placeholder")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>{t("register.password")} <span className="text-[#B12069]">*</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("register.password.placeholder")} className={inputClass + " pr-11"} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{t("register.password.hint")}</p>
            </div>

            <div>
              <label className={labelClass}>{t("register.confirmPassword")} <span className="text-[#B12069]">*</span></label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder={t("register.confirmPassword.placeholder")} className={inputClass + " pr-11"} />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {fieldError && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{fieldError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-[#B12069] text-white font-semibold py-3.5 rounded-full hover:bg-[#8f1a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {status === "submitting" ? t("register.submitting") : t("register.submit")}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t("register.hasAccount")}{" "}
              <Link href="/login" className="text-[#B12069] font-semibold hover:underline">
                {t("register.loginLink")}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
