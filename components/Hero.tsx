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

      <div className="relative z-10 min-h-screen">
        <div className="absolute left-1/2 top-[calc(37%-2cm)] w-full max-w-[280px] -translate-x-1/2 -translate-y-full px-6 text-center md:top-[calc(39%-2cm)] md:max-w-[300px]">
          <div className="glass rounded-xl px-5 py-3 md:px-6 md:py-4">
            <p className="font-serif text-[15px] font-bold uppercase tracking-[0.3em] text-black">
              Save the Date
            </p>
            <p className="mt-2 font-serif text-lg font-bold text-black md:text-xl">
              {dateDisplay}
            </p>
            <p className="mt-1 text-[11px] font-bold tracking-wide text-black md:text-xs">
              {location.city}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center px-6 md:bottom-[12%]">
          <Countdown countdownDate={countdownDate} />

          <div className="mt-12 flex w-full flex-col items-center md:mt-16">
            <a
              href="#details"
              className="glass flex flex-col items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white/40 hover:text-wedding"
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
      </div>
    </section>
  );
}
