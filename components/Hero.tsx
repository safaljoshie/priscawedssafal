import Image from "next/image";
import { wedding } from "@/lib/wedding";
import { Countdown } from "./Countdown";
import { Ornament } from "./Divider";

export function Hero() {
  const { couple, dateDisplay, location } = wedding;

  return (
    <section id="home" className="relative bg-ivory">
      <div className="relative h-[52vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src="/images/couple.png"
          alt={`${couple.bride} and ${couple.groom}`}
          fill
          priority
          sizes="430px"
          className="object-cover object-[center_35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--green-dark)]/85 via-[var(--green-dark)]/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center text-ivory">
          <p className="font-serif text-xs uppercase tracking-[0.4em] text-gold">
            Save the Date
          </p>
          <h1 className="mt-4 font-serif text-[2.75rem] leading-[1.1]">
            {couple.bride}
            <span className="mx-2 italic text-gold">&</span>
            {couple.groom}
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center px-6 py-12 text-center">
        <Ornament />

        <p className="mt-6 font-serif text-xl text-green/90">{dateDisplay}</p>
        <p className="mt-2 text-sm tracking-wide text-[#1a1a1a]/60">
          {location.city}
        </p>

        <Countdown />

        <a
          href="#details"
          className="mt-12 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-green/50 transition-colors hover:text-gold"
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
