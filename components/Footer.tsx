import { wedding } from "@/lib/wedding";
import { Ornament } from "./Divider";

export function Footer() {
  const { couple, hashtag } = wedding;

  return (
    <footer className="bg-white px-6 py-16 text-center">
      <Ornament />
      <p className="mt-6 font-serif text-3xl text-green">
        {couple.bride} & {couple.groom}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold">
        {hashtag}
      </p>
      <p className="mt-8 text-xs text-[#1a1a1a]/40">
        Made with love · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
