import Image from "next/image";
import type { WeddingData } from "@/lib/types";
import { Countdown } from "./Countdown";
import { Ornament } from "./Divider";

export function Hero({ wedding }: { wedding: WeddingData }) {
  const { couple, dateDisplay, location, countdownDate } = wedding;

  return (
    <section
      id="home"
      className="relative bg-ivory md:grid md:min-h-screen md:grid-cols-2"
    >
      <div className="flex items-center justify-center px-6 pt-10 pb-6 md:min-h-screen md:px-12 md:py-16 lg:px-16">
        <Image
          src="/images/hero-couple.png"
          alt={`${couple.bride} and ${couple.groom}`}
          width={1024}
          height={682}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-auto w-full max-w-[380px] rounded-sm object-cover shadow-sm md:max-h-[85vh] md:max-w-none"
        />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-10 text-center md:px-12 md:py-20 lg:px-16">
        <Ornament />

        <p className="mt-6 font-serif text-xl text-green/90 md:mt-8 md:text-2xl">
          {dateDisplay}
        </p>
        <p className="mt-2 text-sm tracking-wide text-[#1a1a1a]/60 md:text-base">
          {location.city}
        </p>

        <Countdown countdownDate={countdownDate} />

        <div className="mt-12 flex w-full flex-col items-center md:mt-16">
          <a
            href="#details"
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-green/50 transition-colors hover:text-gold"
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
