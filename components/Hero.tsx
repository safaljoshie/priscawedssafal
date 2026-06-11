import type { WeddingData } from "@/lib/types";
import { Countdown } from "./Countdown";

export function Hero({ wedding }: { wedding: WeddingData }) {
  const { couple, dateDisplay, location, countdownDate } = wedding;

  return (
    <section id="home" className="relative min-h-screen">
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        role="img"
        aria-label={`${couple.bride} and ${couple.groom}`}
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center md:px-12 md:py-24">
        <div className="glass rounded-2xl px-8 py-5 md:px-10 md:py-6">
          <p className="font-serif text-xl text-ivory md:text-2xl">
            {dateDisplay}
          </p>
          <p className="mt-2 text-sm tracking-wide text-ivory/80 md:text-base">
            {location.city}
          </p>
        </div>

        <Countdown countdownDate={countdownDate} />

        <div className="mt-12 flex w-full flex-col items-center md:mt-16">
          <a
            href="#details"
            className="glass flex flex-col items-center gap-2 rounded-2xl px-4 py-2 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-white/30 hover:text-gold"
          >
            <span>Discover more</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="animate-bounce"
              aria-hidden
            >
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
