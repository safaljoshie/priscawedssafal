import type { WeddingData } from "@/lib/types";
import { Ornament } from "./Divider";

export function Footer({ wedding }: { wedding: WeddingData }) {
  const { couple, hashtag } = wedding;

  return (
    <footer className="bg-white px-6 py-16 text-center md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Ornament />
        <p className="mt-6 font-serif text-3xl text-green md:text-5xl">
          {couple.bride} & {couple.groom}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold md:text-sm">
          {hashtag}
        </p>
        <p className="mt-8 text-xs text-[#1a1a1a]/40 md:text-sm">
          Made with love · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
