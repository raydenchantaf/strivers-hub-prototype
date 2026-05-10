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

    // Consent
    "consent.title": "Welcome to the Strivers' Hub Assessment",
    "consent.body": "In this questionnaire, we will ask you for some personal and background information to enhance our understanding of this project and personalizing your user experience. Your responses will be treated in accordance with our privacy policy. Your information is strictly confidential and will not be disclosed to any external parties except authorized staff within The Asia Foundation Malaysia. Access to your data is secured through a password-protected online repository. Only anonymized data, excluding personal information, may be shared with external parties, such as local governments, to contribute insights for informed policymaking.",
    "consent.checkbox": "I have read and consent to the information stated above.",
    "consent.proceed": "Continue to Assessment",
    "consent.required": "Please accept the consent statement before continuing.",

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

    // 404
    "notfound.title": "Page Not Found",
    "notfound.body": "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    "notfound.home": "Back to Home",
    "notfound.assess": "Take the Assessment",


    // Hero2
    "hero2.headline": "Elevating Malaysian\nWomen Entrepreneurs",
    "hero2.subtext": "We are dedicated to bridging the digitalization gap for Malaysian women entrepreneurs by providing tailored solutions that meet their unique needs.",

    // HowItWorks2
    "how2.card.headline": "Discover Your\nBusiness Potential",
    "how2.card.body": "Join now to access the tools, networks, and resources you need to succeed in your entrepreneurial journey. Together, we can empower women to thrive in the digital economy and transform their business dreams into reality!",
    "how2.card.cta": "Take the Assessment Today",
    "how2.step1.title": "Complete the Assessment",
    "how2.step1.pre": "Take our",
    "how2.step1.bold": "3-minute self-assessment",
    "how2.step1.post": "and get a set of tailored recommendations",
    "how2.step2.title": "View Recommendations",
    "how2.step2.desc": "Explore tailored recommendation for your business journey",
    "how2.step3.title": "Unlock your Business Potential!",
    "how2.step3.desc": "Get exclusive access to our Mentorship Program",

    // Footer2
    "footer2.strategic_partner": "Strategic partner",
    "footer2.supported_by": "Supported by",
    "footer2.tagline": "Strivers\u2019 Hub empowers Malaysian women entrepreneurs by closing the digitalization gap. We provide tailored solutions, tools, and networks that help women-led small businesses thrive in the digital economy and unlock their full potential.",
    "footer2.rights": "\u00a9 2026 Mastercard Strive Malaysia",

    // Footer
    "footer.tagline": "Strivers' Hub empowers Malaysian women entrepreneurs by closing the digitalization gap. We provide tailored solutions, tools, and networks that help women-led small businesses thrive in the digital economy and unlock their full potential.",
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

    // Consent
    "consent.title": "Selamat datang ke Penilaian Kendiri Strivers' Hub",
    "consent.body": "Dalam soalan berikut, kami akan meminta maklumat peribadi dan latar belakang anda untuk meningkatkan pemahaman kami tentang projek ini dan memperibadikan pengalaman pengguna anda. Respons anda akan diuruskan mengikut polisi privasi kami. Maklumat anda adalah sulit dan tidak akan didedahkan kepada mana-mana pihak luar melainkan staf yang diberi kuasa dalam The Asia Foundation Malaysia. Akses kepada data anda dijamin melalui repositori dalam talian yang dilindungi kata laluan. Hanya data tanpa maklumat peribadi yang dianonimkan, mungkin dikongsi dengan pihak luar, seperti kerajaan, untuk menyumbang pandangan bagi penggubalan dasar yang berinformasi.",
    "consent.checkbox": "Saya telah membaca dan bersetuju dengan maklumat yang dinyatakan di atas.",
    "consent.proceed": "Teruskan ke Penilaian",
    "consent.required": "Sila terima pernyataan persetujuan sebelum meneruskan.",

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

    // 404
    "notfound.title": "Halaman Tidak Dijumpai",
    "notfound.body": "Halaman yang anda cari tidak wujud atau telah dialihkan. Jom kembali ke landasan yang betul.",
    "notfound.home": "Kembali ke Laman Utama",
    "notfound.assess": "Mulakan Penilaian",


    // Hero2
    "hero2.headline": "Meningkatkan\nUsahawanita Malaysia",
    "hero2.subtext": "Kami berdedikasi untuk merapatkan jurang digitalisasi bagi usahawanita Malaysia dengan menyediakan penyelesaian yang disesuaikan untuk memenuhi keperluan unik mereka.",

    // HowItWorks2
    "how2.card.headline": "Temui\nPotensi Perniagaan Anda",
    "how2.card.body": "Sertai sekarang untuk mengakses alat, rangkaian, dan sumber yang anda perlukan untuk berjaya dalam perjalanan keusahawanan anda. Bersama-sama, kita boleh memperkasakan wanita untuk berkembang dalam ekonomi digital dan mengubah impian perniagaan mereka menjadi kenyataan!",
    "how2.card.cta": "Ambil Penilaian Hari Ini",
    "how2.step1.title": "Lengkapkan Penilaian",
    "how2.step1.pre": "Ambil",
    "how2.step1.bold": "penilaian kendiri 3 minit",
    "how2.step1.post": "kami dan dapatkan set cadangan yang disesuaikan",
    "how2.step2.title": "Lihat Cadangan",
    "how2.step2.desc": "Terokai cadangan yang disesuaikan untuk perjalanan perniagaan anda",
    "how2.step3.title": "Buka Potensi Perniagaan Anda!",
    "how2.step3.desc": "Dapatkan akses eksklusif kepada Program Mentorship kami",

    // Footer2
    "footer2.strategic_partner": "Rakan Strategik",
    "footer2.supported_by": "Disokong oleh",
    "footer2.tagline": "Strivers\u2019 Hub memperkasakan usahawanita Malaysia dengan merapatkan jurang digitalisasi. Kami menyediakan penyelesaian, alat, dan rangkaian yang disesuaikan untuk membantu perniagaan kecil yang dipimpin wanita berkembang dalam ekonomi digital dan mencapai potensi penuh mereka.",
    "footer2.rights": "\u00a9 2026 Mastercard Strive Malaysia",

    // Footer
    "footer.tagline": "Strivers' Hub empowers Malaysian women entrepreneurs by closing the digitalization gap. We provide tailored solutions, tools, and networks that help women-led small businesses thrive in the digital economy and unlock their full potential.",
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
