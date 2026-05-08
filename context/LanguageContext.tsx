"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

// ─── UI Translations ────────────────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.assessment": "Assessment",
    "nav.resources": "Resources",
    "nav.financing": "Financing",
    "nav.events": "Events",
    "nav.about": "About Us",
    "nav.joinNow": "Join Now",

    // Hero
    "hero.headline": "Elevating Malaysian Women Entrepreneurs",
    "hero.subtext":
      "Join a thriving community designed to help you start, grow, and scale your business with the right tools, training, and support.",
    "hero.cta": "Start Your Journey",
    "hero.assessCta": "Discover Your Business Potential",

    // HowItWorks
    "how.title": "Your Journey Starts Here",
    "how.step1.title": "Assess Your Business",
    "how.step1.desc":
      "Take a quick self-assessment to understand where your business stands today.",
    "how.step2.title": "Get Matched to Resources",
    "how.step2.desc":
      "Receive personalised recommendations for training, mentors, and tools.",
    "how.step3.title": "Grow & Connect",
    "how.step3.desc":
      "Join a network of like-minded women entrepreneurs and unlock new opportunities.",

    // Stats
    "stats.title": "Creating Opportunities, Inspiring Change",
    "stats.subtitle": "for Women Entrepreneurs",
    "stats.programs": "Programs",
    "stats.entrepreneurs": "Entrepreneurs Reached",
    "stats.satisfaction": "Satisfaction Rate",

    // Partners
    "partners.title": "Expand Your Digital Journey Beyond Strivers' Hub",
    "partners.subtitle":
      "We've partnered with leading organisations to bring you more opportunities.",

    // Community
    "community.title": "What's Happening in Our Community",
    "community.viewAll": "View All Events",

    // CTA Banner
    "cta.title": "Elevate your business with like-minded female entrepreneurs",
    "cta.button": "Join Strivers' Hub",

    // Insights
    "insights.title": "Insights & Resources",
    "insights.viewAll": "View All",
    "insights.readMore": "Read More",

    // Assessment page
    "assess.title": "Business Readiness Assessment",
    "assess.subtitle":
      "Answer 10 questions to discover your entrepreneurial stage and get personalised recommendations.",
    "assess.start": "Start Assessment",
    "assess.next": "Next",
    "assess.prev": "Previous",
    "assess.submit": "See My Results",
    "assess.question": "Question",
    "assess.of": "of",
    "assess.progress": "Your Progress",

    // Results
    "results.title": "Your Assessment Results",
    "results.score": "Your Score",
    "results.category": "Your Category",
    "results.next_steps": "Recommended Next Steps",
    "results.retake": "Retake Assessment",
    "results.explore": "Explore Resources",

    // Resources
    "resources.title": "Insights & Resources",
    "resources.subtitle":
      "Curated articles, guides, and tools to help your business grow.",
    "resources.all": "All",
    "resources.finance": "Finance",
    "resources.digital": "Digital",
    "resources.marketing": "Marketing",
    "resources.legal": "Legal",

    // Footer
    "footer.tagline": "Empowering Malaysian women to build thriving businesses.",
    "footer.links": "Quick Links",
    "footer.contact": "Contact Us",
    "footer.rights": "© 2026 Strivers' Hub. All rights reserved.",
  },

  bm: {
    // Nav
    "nav.assessment": "Penilaian",
    "nav.resources": "Sumber",
    "nav.financing": "Pembiayaan",
    "nav.events": "Acara",
    "nav.about": "Tentang Kami",
    "nav.joinNow": "Daftar Sekarang",

    // Hero
    "hero.headline": "Meningkatkan Usahawanita Malaysia",
    "hero.subtext":
      "Sertai komuniti yang direka untuk membantu anda memulakan, mengembangkan, dan menskalakan perniagaan anda dengan alat, latihan, dan sokongan yang tepat.",
    "hero.cta": "Mulakan Perjalanan Anda",
    "hero.assessCta": "Temui Potensi Perniagaan Anda",

    // HowItWorks
    "how.title": "Perjalanan Anda Bermula Di Sini",
    "how.step1.title": "Nilai Perniagaan Anda",
    "how.step1.desc":
      "Lakukan penilaian diri ringkas untuk memahami kedudukan perniagaan anda hari ini.",
    "how.step2.title": "Dapatkan Sumber Yang Sesuai",
    "how.step2.desc":
      "Terima cadangan peribadi untuk latihan, mentor, dan alat yang sesuai.",
    "how.step3.title": "Berkembang & Berhubung",
    "how.step3.desc":
      "Sertai rangkaian usahawanita yang berfikiran sama dan buka peluang baharu.",

    // Stats
    "stats.title": "Mencipta Peluang, Mengilhamkan Perubahan",
    "stats.subtitle": "untuk Usahawanita",
    "stats.programs": "Program",
    "stats.entrepreneurs": "Usahawan Dicapai",
    "stats.satisfaction": "Kadar Kepuasan",

    // Partners
    "partners.title": "Luaskan Perjalanan Digital Anda Melampaui Strivers' Hub",
    "partners.subtitle":
      "Kami telah bekerjasama dengan organisasi terkemuka untuk membawa lebih banyak peluang kepada anda.",

    // Community
    "community.title": "Apa Yang Berlaku Dalam Komuniti Kami",
    "community.viewAll": "Lihat Semua Acara",

    // CTA Banner
    "cta.title": "Tingkatkan perniagaan anda bersama usahawanita yang berfikiran sama",
    "cta.button": "Sertai Strivers' Hub",

    // Insights
    "insights.title": "Pandangan & Sumber",
    "insights.viewAll": "Lihat Semua",
    "insights.readMore": "Baca Lagi",

    // Assessment
    "assess.title": "Penilaian Kesediaan Perniagaan",
    "assess.subtitle":
      "Jawab 10 soalan untuk mengetahui peringkat keusahawanan anda dan dapatkan cadangan peribadi.",
    "assess.start": "Mulakan Penilaian",
    "assess.next": "Seterusnya",
    "assess.prev": "Sebelumnya",
    "assess.submit": "Lihat Keputusan Saya",
    "assess.question": "Soalan",
    "assess.of": "daripada",
    "assess.progress": "Kemajuan Anda",

    // Results
    "results.title": "Keputusan Penilaian Anda",
    "results.score": "Skor Anda",
    "results.category": "Kategori Anda",
    "results.next_steps": "Langkah Seterusnya Yang Disyorkan",
    "results.retake": "Ulang Penilaian",
    "results.explore": "Jelajahi Sumber",

    // Resources
    "resources.title": "Pandangan & Sumber",
    "resources.subtitle":
      "Artikel, panduan, dan alat yang dipilih khas untuk membantu perniagaan anda berkembang.",
    "resources.all": "Semua",
    "resources.finance": "Kewangan",
    "resources.digital": "Digital",
    "resources.marketing": "Pemasaran",
    "resources.legal": "Undang-undang",

    // Footer
    "footer.tagline": "Memperkasakan wanita Malaysia membina perniagaan yang berjaya.",
    "footer.links": "Pautan Pantas",
    "footer.contact": "Hubungi Kami",
    "footer.rights": "© 2026 Strivers' Hub. Hak cipta terpelihara.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
