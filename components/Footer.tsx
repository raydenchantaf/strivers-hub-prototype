"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-max section-padding py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.webp" alt="Strivers' Hub" width={185} height={55} />
              </Link>
            </div>
            <p className="text-white text-sm leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex gap-4 mt-5">
              {/* Social Icons */}
              {["facebook", "instagram", "linkedin"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={s}
                >
                  <span className="text-xs font-bold text-white uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.links")}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("nav.assessment"), href: "/assessment" },
                { label: t("nav.resources"), href: "/resources" },
                { label: t("nav.financing"), href: "#" },
                { label: t("nav.events"), href: "#" },
                { label: t("nav.about"), href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>hello@strivershub.my</li>
              <li>+60 3-XXXX XXXX</li>
              <li>Kuala Lumpur, Malaysia</li>
            </ul>
            {/* Partner logos placeholder */}
            <div className="mt-6 flex items-center gap-4">
              <div className="bg-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 font-semibold">
                Mastercard
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 font-semibold">
                Asia Foundation
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white text-xs">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
