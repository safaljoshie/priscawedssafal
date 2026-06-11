import Image from "next/image";
import type { WeddingData } from "@/lib/types";
import { Countdown } from "./Countdown";

export function Hero({ wedding }: { wedding: WeddingData }) {
  const { couple, dateDisplay, location, countdownDate } = wedding;

  return (
    <section id="home" className="relative min-h-screen bg-ivory">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center md:px-12 md:py-24">
        <Image
          src="/images/save-the-date.png"
          alt={`Save the Date — ${couple.bride} and ${couple.groom}`}
          width={1024}
          height={1024}
          priority
          sizes="(max-width: 768px) 340px, 400px"
          className="h-auto w-full max-w-[340px] md:max-w-[400px]"
        />

        <div className="glass mt-6 rounded-2xl px-8 py-5 md:mt-8">
          <p className="font-serif text-xl text-green md:text-2xl">
            {dateDisplay}
          </p>
          <p className="mt-2 text-sm tracking-wide text-green/80 md:text-base">
            {location.city}
          </p>
        </div>

        <Countdown countdownDate={countdownDate} />

        <div className="mt-12 flex w-full flex-col items-center md:mt-16">
          <a
            href="#details"
            className="glass flex flex-col items-center gap-2 rounded-2xl px-4 py-2 text-xs uppercase tracking-[0.25em] text-green transition-colors hover:bg-white/30 hover:text-gold"
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

          <Image
            src="/images/psj-monogram.png"
            alt={`${couple.bride} and ${couple.groom} monogram`}
            width={936}
            height={873}
            className="mx-auto mt-8 h-auto w-full max-w-[200px] md:max-w-[240px]"
          />
        </div>
      </div>
    </section>
  );
}
