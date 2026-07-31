"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const { t }   = useLanguage();
  const router  = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
  });
  const [loading, setLoading]       = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving">("idle");
  const [saveMsg, setSaveMsg]       = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm]   = useState("");
  const [deleteStatus, setDeleteStatus]     = useState<"idle" | "deleting">("idle");
  const [deleteError, setDeleteError]       = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setForm({
            firstName: data.firstName,
            lastName:  data.lastName,
            email:     data.email,
            phone:     data.phone ?? "",
          });
        } else {
          // Not logged in
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setSaveMsg(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    setSaveStatus("saving");

    try {
      const res  = await fetch("/api/profile", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSaveMsg({ type: "success", text: t("profile.success") });
      } else if (data.error === "EMAIL_EXISTS") {
        setSaveMsg({ type: "error", text: t("profile.error.emailExists") });
      } else {
        setSaveMsg({ type: "error", text: t("profile.error.generic") });
      }
    } catch {
      setSaveMsg({ type: "error", text: t("profile.error.generic") });
    } finally {
      setSaveStatus("idle");
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE") {
      setDeleteError(t("profile.delete.error.confirm"));
      return;
    }
    setDeleteError(null);
    setDeleteStatus("deleting");

    try {
      const res  = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        router.push("/account-deleted");
      } else {
        setDeleteError(t("profile.delete.error.generic"));
        setDeleteStatus("idle");
      }
    } catch {
      setDeleteError(t("profile.delete.error.generic"));
      setDeleteStatus("idle");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-rose flex items-center justify-center">
        <p className="text-white/70 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose flex items-start justify-center section-padding py-16">
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* ── Account Info ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("profile.heading")}
            </h1>
            <div className="w-12 h-1 bg-accent rounded-full mt-3" />
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              {t("profile.section.info")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("profile.firstName")} <span className="text-accent">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder={t("profile.firstName.placeholder")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("profile.lastName")} <span className="text-accent">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder={t("profile.lastName.placeholder")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("profile.email")} <span className="text-accent">*</span></label>
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("profile.email.placeholder")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>{t("profile.phone")}</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("profile.phone.placeholder")} className={inputClass} />
            </div>

            {saveMsg && (
              <p className={[
                "text-sm rounded-xl px-4 py-3 border",
                saveMsg.type === "success"
                  ? "text-green-700 bg-green-50 border-green-100"
                  : "text-red-500 bg-red-50 border-red-100",
              ].join(" ")}>
                {saveMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="w-full bg-accent text-white font-semibold py-3.5 rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveStatus === "saving" ? t("profile.saving") : t("profile.save")}
            </button>
          </form>
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-8 md:p-10">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
            {t("profile.section.danger")}
          </p>
          <h2 className="text-lg font-extrabold text-gray-900 mb-2">
            {t("profile.delete.heading")}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {t("profile.delete.description")}
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass + " text-red-600"}>
                {t("profile.delete.confirm.label")}
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteError(null); }}
                placeholder={t("profile.delete.confirm.placeholder")}
                className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition"
              />
            </div>

            {deleteError && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {deleteError}
              </p>
            )}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteStatus === "deleting"}
              className="w-full bg-red-500 text-white font-semibold py-3.5 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteStatus === "deleting" ? t("profile.delete.deleting") : t("profile.delete.button")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
