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
          src="/images/save-the-date.png"
          alt={`Save the Date — ${couple.bride} and ${couple.groom}`}
          width={800}
          height={800}
          priority
          sizes="(max-width: 768px) 380px, 50vw"
          className="h-auto w-full max-w-[380px] md:max-w-md lg:max-w-lg"
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

        <a
          href="#details"
          className="mt-12 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-green/50 transition-colors hover:text-gold md:mt-16"
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
    </section>
  );
}
