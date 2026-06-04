"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function validatePassword(pw: string) {
  return pw.length >= 8;
}

interface Prefill {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
}

interface Props {
  onSkip:   () => void; // user dismissed — caller navigates to /results
  prefill?: Prefill;
}

export default function RegistrationGate({ onSkip, prefill }: Props) {
  const { t } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName:       prefill?.firstName       ?? "",
    lastName:        prefill?.lastName        ?? "",
    email:           prefill?.email           ?? "",
    phone:           prefill?.phone           ?? "",
    password:        "",
    confirmPassword: "",
  });
  const [status, setStatus]         = useState<"idle" | "submitting">("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
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
      const regRes  = await fetch("/api/submit-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone, password: form.password,
        }),
      });
      const regData = await regRes.json();

      if (!regData.success) {
        setFieldError(regData.error === "EMAIL_EXISTS" ? t("register.error.emailExists") : t("register.error"));
        setStatus("idle");
        return;
      }

      // Auto-login
      const loginRes  = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();

      if (loginData.success) {
        router.push("/dashboard");
      } else {
        // Registered but login failed — still send to results
        onSkip();
      }
    } catch {
      setFieldError(t("register.error"));
      setStatus("idle");
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";
  const labelCls = "block text-xs font-semibold text-gray-700 mb-1";

  const benefits = [
    t("gate.benefit1"),
    t("gate.benefit2"),
    t("gate.benefit3"),
  ];

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row">

        {/* ── Left panel ── */}
        <div
          className="md:w-[42%] flex-shrink-0 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none p-8 md:p-10 flex flex-col justify-between gap-8"
          style={{ background: "linear-gradient(145deg, #6B1040 0%, #A0244F 60%, #C45A3A 100%)" }}
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-white leading-snug">
              {t("gate.headline")}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              {t("gate.description")}
            </p>
            <ul className="flex flex-col gap-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 bg-white/15 rounded-full px-5 py-3">
                  <span className="w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white font-semibold text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skip link */}
          <button
            onClick={onSkip}
            className="text-white/60 text-xs hover:text-white transition-colors underline underline-offset-2 text-left"
          >
            {t("gate.skip")} →
          </button>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">

          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
            {t("gate.heading")}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t("register.firstName")} <span className="text-primary">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder={t("register.firstName.placeholder")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t("register.lastName")} <span className="text-primary">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder={t("register.lastName.placeholder")} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>{t("register.email")} <span className="text-primary">*</span></label>
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("register.email.placeholder")} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{t("register.phone")} <span className="text-primary">*</span></label>
              <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("register.phone.placeholder")} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{t("register.password")} <span className="text-primary">*</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("register.password.placeholder")} className={inputCls + " pr-11"} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{t("register.password.hint")}</p>
            </div>

            <div>
              <label className={labelCls}>{t("register.confirmPassword")} <span className="text-primary">*</span></label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder={t("register.confirmPassword.placeholder")} className={inputCls + " pr-11"} />
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
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{fieldError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
              {status === "submitting" ? t("register.submitting") : t("register.submit")}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
