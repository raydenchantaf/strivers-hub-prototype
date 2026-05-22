"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ArticleBackLink() {
  const { language } = useLanguage();
  return (
    <Link
      href="/resources"
      className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary mb-6 transition-colors"
    >
      ← {language === "bm" ? "Kembali ke Sumber" : "Back to Resources"}
    </Link>
  );
}
