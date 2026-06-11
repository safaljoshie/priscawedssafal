"use client";

import { useEffect, useState } from "react";
import { navLinks, wedding } from "@/lib/wedding";

export function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { couple } = wedding;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 md:translate-y-0 md:opacity-100 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0 md:pointer-events-auto"
      }`}
      aria-label="Section navigation"
    >
      <div className="border-b border-gold/15 bg-white/90 backdrop-blur-md md:bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-12 md:py-4">
          <a
            href="#home"
            className="hidden font-serif text-lg text-green transition-colors hover:text-gold md:block lg:text-xl"
          >
            {couple.bride} & {couple.groom}
          </a>

          <ul className="flex w-full items-center justify-between gap-1 md:w-auto md:justify-end md:gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block px-1.5 py-1 text-[10px] uppercase tracking-[0.15em] text-green/70 transition-colors hover:text-gold md:px-0 md:text-xs md:tracking-[0.2em]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
