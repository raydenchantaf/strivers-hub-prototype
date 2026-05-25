"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function validatePassword(pw: string) {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);
}

interface Props {
  onSkip: () => void; // user dismissed — caller navigates to /results
}

export default function RegistrationGate({ onSkip }: Props) {
  const { t } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [status, setStatus]       = useState<"idle" | "submitting">("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

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
              <input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("register.password.placeholder")} className={inputCls} />
              <p className="text-[11px] text-gray-400 mt-1">{t("register.password.hint")}</p>
            </div>

            <div>
              <label className={labelCls}>{t("register.confirmPassword")} <span className="text-primary">*</span></label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder={t("register.confirmPassword.placeholder")} className={inputCls} />
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
