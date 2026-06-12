"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

type Props = {
  couple: { bride: string; groom: string };
};

const navItems = [
  { href: "#details", key: "details" as const },
  { href: "#updates", key: "updates" as const },
  { href: "#travel", key: "travel" as const },
  { href: "#rsvp", key: "rsvp" as const },
];

export function Nav({ couple }: Props) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 md:translate-y-0 md:opacity-100 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0 md:pointer-events-auto"
      }`}
      aria-label="Section navigation"
    >
      <div className="border-b border-gold/15 bg-white/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-1.5 md:px-12 md:py-2">
          <a
            href="#home"
            className="hidden font-serif text-base text-black transition-colors hover:text-wedding md:block lg:text-lg"
          >
            {couple.bride} & {couple.groom}
          </a>

          <ul className="flex flex-1 items-center justify-between gap-1 md:w-auto md:flex-none md:justify-end md:gap-6">
            {navItems.map(({ href, key }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block px-1.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-black transition-colors hover:text-wedding md:px-0 md:text-xs md:tracking-[0.2em]"
                >
                  {t.nav[key]}
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <LanguageToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
