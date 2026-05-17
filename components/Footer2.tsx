"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaYoutube,  href: "#", label: "YouTube" },
];

export default function Footer2() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-max px-4 md:px-8 pt-10 pb-8">

        {/* Top logo row */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8 pb-8">

          <div>
            <Link href="/">
              <Image
                src="/logo.white.svg"
                alt="Strivers Hub"
                width={186}
                height={55}
                className="h-[65px] w-auto object-contain object-left"
              />
            </Link>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-xs font-bold text-white uppercase tracking-wide">
              {t("footer2.strategic_partner")}
            </p>
            <Image
              src="/MyDigital.white.png"
              alt="MyDIGITAL"
              width={160}
              height={48}
              className="h-[65px] w-auto object-contain object-left"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-xs font-bold text-white uppercase tracking-wide">
              {t("footer2.supported_by")}
            </p>
            <Image
              src="/CFIG.white.png"
              alt="Center for Inclusive Growth"
              width={200}
              height={48}
              className="h-[65px] w-auto object-contain object-left"
            />
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/20" />

        {/* Description */}
        <p className="max-w-lg text-sm text-white/80 leading-relaxed mt-8 mb-10">
          {t("footer2.tagline")}
        </p>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="text-xs text-white/60 uppercase tracking-widest">
              {t("footer2.rights")}
            </p>
            <Link
              href="/privacy-policy"
              className="text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              {t("footer2.privacyPolicy")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors duration-200"
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
