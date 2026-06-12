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

const mobileItems = [
  { id: "home", href: "#home", key: "home" as const },
  { id: "details", href: "#details", key: "details" as const },
  { id: "updates", href: "#updates", key: "updates" as const },
  { id: "travel", href: "#travel", key: "travel" as const },
  { id: "rsvp", href: "#rsvp", key: "rsvp" as const },
] as const;

const sectionIds = mobileItems.map((item) => item.id);

export function Nav({ couple }: Props) {
  const { locale, t } = useLanguage();
  const [activeSection, setActiveSection] = useState("home");
  const isNepali = locale === "ne";

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop — top bar */}
      <nav
        className="fixed inset-x-0 top-0 z-50 hidden md:block"
        aria-label="Section navigation"
      >
        <div className="border-b border-gold/15 bg-white/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-12 py-2">
            <a
              href="#home"
              className="font-serif text-base text-black transition-colors hover:text-wedding lg:text-lg"
            >
              {couple.bride} & {couple.groom}
            </a>

            <ul className="flex items-center gap-6">
              {navItems.map(({ href, key }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block text-xs uppercase tracking-[0.2em] text-black transition-colors hover:text-wedding"
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

      {/* Mobile — language toggle top-right */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <LanguageToggle />
      </div>

      {/* Mobile — floating bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Section navigation"
      >
        <div className="flex w-full max-w-lg items-center justify-between gap-0.5 rounded-full border border-white/50 bg-white/35 px-1 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
          {mobileItems.map(({ id, href, key }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={href}
                className={`flex flex-1 items-center justify-center rounded-full px-0.5 py-2 text-center font-bold leading-none transition-colors ${
                  isNepali
                    ? "font-serif text-[9px] tracking-wide"
                    : "text-[8px] uppercase tracking-[0.08em]"
                } ${isActive ? "bg-black/10 text-wedding" : "text-black hover:bg-black/5"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {t.nav[key]}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
