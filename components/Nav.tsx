"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

type Props = {
  couple: { bride: string; groom: string };
};

const navItems = [
  { href: "#details", key: "details" as const },
  { href: "#updates", key: "updates" as const },
  { href: "#travel", key: "travel" as const },
  { href: "#dress-code", key: "attire" as const },
  { href: "#faq", key: "faq" as const },
  { href: "#rsvp", key: "rsvp" as const },
];

const mobileItems = [
  { id: "home", href: "#home", key: "home" as const },
  { id: "details", href: "#details", key: "details" as const },
  { id: "updates", href: "#updates", key: "updates" as const },
  { id: "rsvp", href: "#rsvp", key: "rsvp" as const },
] as const;

const moreLinks = [
  { href: "#travel", key: "travel" as const, id: "travel" },
  { href: "#dress-code", key: "attire" as const, id: "dress-code" },
  { href: "#faq", key: "faq" as const, id: "faq" },
] as const;

const sectionIds = [
  ...mobileItems.map((item) => item.id),
  ...moreLinks.map((link) => link.id),
];

export function Nav({ couple }: Props) {
  const { locale, t } = useLanguage();
  const [activeSection, setActiveSection] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const isNepali = locale === "ne";
  const isMoreActive = moreLinks.some((link) => link.id === activeSection);

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

  useEffect(() => {
    if (!moreOpen) return;

    const close = (event: MouseEvent | TouchEvent) => {
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [moreOpen]);

  const mobileLinkClass = (isActive: boolean) =>
    `flex min-h-[44px] flex-1 items-center justify-center rounded-full px-0.5 py-2.5 text-center font-bold leading-tight transition-colors ${
      isNepali
        ? "font-serif text-[11px] tracking-wide"
        : "text-[10px] uppercase tracking-[0.06em]"
    } ${isActive ? "bg-black/10 text-wedding" : "text-black hover:bg-black/5"}`;

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

            <ul className="flex items-center gap-5 lg:gap-6">
              {navItems.map(({ href, key }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`block text-xs font-bold tracking-[0.2em] text-black transition-colors hover:text-wedding ${
                      isNepali ? "font-serif tracking-wide" : "uppercase"
                    }`}
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
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Section navigation"
      >
        <div ref={mobileNavRef} className="relative w-full max-w-lg">
          {moreOpen && (
            <div
              className="absolute bottom-full left-1/2 mb-2 w-[min(100%,14rem)] -translate-x-1/2 rounded-2xl border border-white/50 bg-white/90 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
              role="menu"
            >
              {moreLinks.map(({ href, key, id }) => (
                <a
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={`flex min-h-[44px] items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    isNepali ? "font-serif" : "uppercase tracking-[0.12em]"
                  } ${
                    activeSection === id
                      ? "bg-black/10 text-wedding"
                      : "text-black hover:bg-black/5"
                  }`}
                >
                  {t.nav[key]}
                </a>
              ))}
            </div>
          )}

          <div className="flex w-full items-stretch justify-between gap-0.5 rounded-full border border-white/50 bg-white/35 px-1 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
            {mobileItems.map(({ id, href, key }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={href}
                  className={mobileLinkClass(isActive)}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMoreOpen(false)}
                >
                  {t.nav[key]}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className={mobileLinkClass(isMoreActive || moreOpen)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              {t.nav.more}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
