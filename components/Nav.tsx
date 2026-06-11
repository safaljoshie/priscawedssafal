"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/wedding";

export function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 mx-auto max-w-phone transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      aria-label="Section navigation"
    >
      <div className="border-b border-gold/15 bg-white/90 px-4 py-3 backdrop-blur-md">
        <ul className="flex items-center justify-between gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="block px-1.5 py-1 text-[10px] uppercase tracking-[0.15em] text-green/70 transition-colors hover:text-gold"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
