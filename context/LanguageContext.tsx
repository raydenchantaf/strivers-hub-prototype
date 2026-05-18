"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "./translations";

export type Language = "en" | "bm";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("bm");

  useEffect(() => {
    document.documentElement.lang = language === "bm" ? "ms" : "en";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
