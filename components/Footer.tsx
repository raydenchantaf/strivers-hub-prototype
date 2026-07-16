"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: FaFacebook,  href: "https://www.facebook.com/strivershub/",                  label: "Facebook"  },
  { icon: FaInstagram, href: "https://www.instagram.com/strivers.hub/",                label: "Instagram" },
  { icon: FaLinkedin,  href: "https://www.linkedin.com/company/the-asia-foundation",   label: "LinkedIn"  },
  { icon: FaYoutube,   href: "https://www.youtube.com/@StriversHUB",                   label: "YouTube"   },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-max px-4 md:px-8 pt-10 pb-8">

        {/* Top logo row — flex so each logo keeps natural width, gap is consistent */}
        <div className="flex flex-wrap items-end gap-x-10 gap-y-6 pb-8">

          {/* Strivers Hub */}
          <div>
            <Image
              src="/logo.white.svg"
              alt="Strivers Hub"
              width={160}
              height={48}
              className="h-[55px] w-auto object-contain"
            />
          </div>


          {/* Strategic Partner: MyDigital */}
          <div className="mr-16">
            <Image
              src="/MyDigitalCorp.white.png"
              alt="MyDIGITAL Corporation"
              width={120}
              height={48}
              className="h-[55px] w-auto object-contain"
            />
          </div>


          {/* Implementing Partner: TAF */}
          <div className="flex flex-col items-start gap-2 mr-10">
            <p className="text-xs font-bold text-white tracking-wide">
              {t("footer.implementing_partner")}
            </p>
            <div className="h-[50px] content-center">
              <Image
              src="/TAF.white.webp"
              alt="The Asia Foundation"
              width={232}
              height={35}
              className="h-[35px] w-auto object-contain"
            />
            </div>
          </div>

          

          {/* Supported by: CFIG */}
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs font-bold text-white tracking-wide">
              {t("footer.partnership_with")}
            </p>
            <Image
              src="/CFIG.white.png"
              alt="Center for Inclusive Growth"
              width={160}
              height={48}
              className="h-[50px] w-auto object-contain"
            />
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/20" />

        {/* Description */}
        <p className="max-w-lg text-sm text-white/80 leading-relaxed mt-8 mb-10">
          {t("footer.tagline")}
        </p>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="text-xs text-white/60 uppercase tracking-widest">
              {t("footer.rights")}
            </p>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              {t("footer.privacyPolicy")}
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
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
